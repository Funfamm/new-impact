
// Types for Google API
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const API_KEY = process.env.API_KEY || ''; // We use the same key for simplicity, though usually Drive needs OAuth
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

const CONFIG_FILE_NAME = 'ai_impact_media_config.json';

export class GoogleDriveService {
  tokenClient: any;
  isInitialized = false;
  accessToken: string | null = null;

  constructor() {
    this.initializeGapiClient();
  }

  async initializeGapiClient() {
    if (!window.gapi || !window.google) {
      console.warn("Google Scripts not loaded yet. Retrying...");
      setTimeout(() => this.initializeGapiClient(), 500);
      return;
    }

    // Initialize the GAPI client for API calls
    await new Promise<void>((resolve) => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        resolve();
      });
    });

    // Initialize the GIS client for Authentication
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          this.accessToken = tokenResponse.access_token;
          // Store token briefly or handle in state
          console.log("Drive Access Granted");
        }
      },
    });

    this.isInitialized = true;
  }

  async signIn(): Promise<boolean> {
    if (!this.tokenClient) return false;
    
    return new Promise((resolve) => {
      // Override the callback for this specific request to know when it's done
      this.tokenClient.callback = (resp: any) => {
        if (resp.error !== undefined) {
          resolve(false);
          throw (resp);
        }
        this.accessToken = resp.access_token;
        resolve(true);
      };
      
      // Trigger prompt
      if (window.gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({prompt: 'consent'});
      } else {
        this.tokenClient.requestAccessToken({prompt: ''});
      }
    });
  }

  // Find the config file in Drive
  async findConfigFile(): Promise<string | null> {
    try {
      const response = await window.gapi.client.drive.files.list({
        q: `name = '${CONFIG_FILE_NAME}' and trashed = false`,
        fields: 'files(id, name)',
        spaces: 'drive',
      });
      const files = response.result.files;
      if (files && files.length > 0) {
        return files[0].id;
      }
      return null;
    } catch (err) {
      console.error("Error searching Drive:", err);
      return null;
    }
  }

  // Create or Update the config file
  async saveConfigToDrive(data: any): Promise<void> {
    if (!this.accessToken) {
      console.warn("No access token. Cannot save to Drive.");
      return;
    }

    const fileContent = JSON.stringify(data);
    const fileId = await this.findConfigFile();

    const fileMetadata = {
      name: CONFIG_FILE_NAME,
      mimeType: 'application/json',
    };

    const multipartRequestBody =
      `\r\n--foo_bar_baz\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      JSON.stringify(fileMetadata) +
      `\r\n--foo_bar_baz\r\n` +
      `Content-Type: application/json\r\n\r\n` +
      fileContent +
      `\r\n--foo_bar_baz--`;

    try {
      if (fileId) {
        // Update existing
        await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'multipart/related; boundary=foo_bar_baz',
          },
          body: multipartRequestBody,
        });
      } else {
        // Create new
        await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'multipart/related; boundary=foo_bar_baz',
          },
          body: multipartRequestBody,
        });
      }
      console.log("Config saved to Drive");
    } catch (e) {
      console.error("Failed to save to Drive", e);
    }
  }

  // Load config
  async loadConfigFromDrive(): Promise<any | null> {
    if (!this.accessToken) return null;

    const fileId = await this.findConfigFile();
    if (!fileId) return null;

    try {
      const response = await window.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });
      return response.result; // This is the JSON object
    } catch (err) {
      console.error("Error loading file from Drive:", err);
      return null;
    }
  }
}

export const driveService = new GoogleDriveService();

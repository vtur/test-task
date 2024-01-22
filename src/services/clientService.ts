import axios, { AxiosRequestConfig } from 'axios';
import readlineSync from 'readline-sync';

export class ClientService {
  private authToken: string | undefined;
  private serverUrl: string;
  private authConfig: AxiosRequestConfig;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  private getUserInput(prompt: string): string {
    return readlineSync.question(prompt).trim();
  }

  public isAuth(): boolean | AxiosRequestConfig {
    return this.authToken ? true : false;
  }

  private checkAuth(): boolean | AxiosRequestConfig {
    if (!this.authToken) {
      console.error('Token not available. Please log in first.');
      return false;
    }
    this.authConfig = {
      headers: { Authorization: this.authToken },
    };
    return true;
  }

  public async askOptionNumber(): Promise<string> {
    return this.getUserInput('Enter the option number: ');
  }

  public async registerUser(): Promise<void> {
    try {
      const username = this.getUserInput('Enter username: ');
      const password = this.getUserInput('Enter password: ');

      const response = await axios.post<{ token: string }>(`${this.serverUrl}/register`, { username, password });
      console.log('Registration successful. Login successful.');
      this.authToken = response.data.token;
      
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  }

  public async loginUser(): Promise<void> {
    try {
      const username = this.getUserInput('Enter username: ');
      const password = this.getUserInput('Enter password: ');

      const response = await axios.post<{ token: string }>(`${this.serverUrl}/login`, { username, password });
      this.authToken = response.data.token;
      console.log('Login successful.');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  }

  public async getCars(): Promise<void> {
    try {
      if (!this.checkAuth()) return;

      const response = await axios.get(`${this.serverUrl}/cars`, this.authConfig);
      console.log('Cars:', response.data);
    } catch (error) {
      console.error('Failed to get cars:', error.response ? error.response.data : error.message);
    }
  }

  public async getCarsByBrand(): Promise<void> {
    try {
      if (!this.checkAuth()) return;

      const brand = this.getUserInput('Enter car brand to filter: ');

      const wantToSort = readlineSync.keyInYNStrict('Do you want to sort the results?');
      let sortField: string | undefined;
      let sortOrder: string | undefined;

      if (wantToSort) {
        sortField = this.getUserInput('Enter the field to sort by (e.g., "price"): ');

        const ascending = readlineSync.keyInYNStrict('Sort in ascending order?');
        sortOrder = ascending ? 'asc' : 'desc';
      }

      const config: AxiosRequestConfig = {
        ...this.authConfig,
        params: { sortField, sortOrder }
      };

      const response = await axios.get(`${this.serverUrl}/cars/${brand}`, config);
      console.log(`Cars of brand ${brand}:`, response.data);
    } catch (error) {
      console.error('Failed to get cars by brand:', error.response ? error.response.data : error.message);
    }
  }

  public async addCar(): Promise<void> {
    try {
      if (!this.checkAuth()) return;

      let name: string;
      while (!name) {
        name = this.getUserInput('Enter car name: ').trim();
        if (!name) {
          console.log('Car name is required. Please enter a valid name.');
        }
      }

      const brand = this.getUserInput('Enter car brand: ');
      const year = parseInt(this.getUserInput('Enter car year: '), 10);
      const price = parseFloat(this.getUserInput('Enter car price: '));

      const response = await axios.post(`${this.serverUrl}/cars`, { brand, name, year, price }, this.authConfig);
      console.log('Car added:', response.data);
    } catch (error) {
      console.error('Failed to add car:', error.response ? error.response.data : error.message);
    }
  }

  public async updateCar(): Promise<void> {
    try {
      if (!this.checkAuth()) return;

      const carId = this.getUserInput('Enter car ID to update: ');
      const brand = this.getUserInput('Enter new car brand: ');
      const name = this.getUserInput('Enter new car name: ');
      const year = parseInt(this.getUserInput('Enter new car year: '), 10);
      const price = parseFloat(this.getUserInput('Enter new car price: '));

      const response = await axios.put(`${this.serverUrl}/cars/${carId}`, { brand, name, year, price }, this.authConfig);
      console.log('Car updated:', response.data);
    } catch (error) {
      console.error('Failed to update car:', error.response ? error.response.data : error.message);
    }
  }

  public async deleteCar(): Promise<void> {
    try {
      if (!this.checkAuth()) return;

      const carId = this.getUserInput('Enter car ID to delete: ');

      const config: AxiosRequestConfig = {
        headers: { Authorization: this.authToken },
      };

      const response = await axios.delete(`${this.serverUrl}/cars/${carId}`, this.authConfig);
      console.log('Car deleted:', response.data.message);
    } catch (error) {
      console.error('Failed to delete car:', error.response ? error.response.data : error.message);
    }
  }
}
const API_BASE_URL = ' http://localhost:8000/api/v1';

let forceLogoutFn: () => void = () => {};

export const setForceLogout = (fn: () => void) => {
  forceLogoutFn = fn;
};

class ApiService{

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
  async getTipById(id: string) {
  const response = await fetch(`${API_BASE_URL}/tips/tip/${id}`, {
    headers: this.getAuthHeaders(),
  });
  return this.handleResponse(response);
  }


  private async handleResponse(response: Response) {
    if (response.status === 403) {
      forceLogoutFn(); // will use global router now
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response format.');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Unexpected error');
    }

    return data;
  }

  async generateOtp(email: string) {
    const response = await fetch(`${API_BASE_URL}/users/generate-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse(response);
  }
  
  async verifyOtp(email: string, code: string) {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    return this.handleResponse(response);
  }

  async signup(userData: { email: string; name: string; password: string; role?: string }) {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async checkAdminExists() {
    const response = await fetch(`${API_BASE_URL}/users/check-admin`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleResponse(response);
  }
  
}

export const apiService = new ApiService();
export class Loader {
  checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      throw new Error(`${response.status} (${response.statusText})`);
    }
  }

  async get(url, cb) {
    try {
      const response = await fetch(url);
      const data = await this.checkStatus(response).json();
      cb(data);
    } catch (e) {
      throw new Error('Error. Try later.');
    }
  }
}

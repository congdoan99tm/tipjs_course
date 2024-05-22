class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    // Set lại prototype nếu cần thiết
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default CustomError;

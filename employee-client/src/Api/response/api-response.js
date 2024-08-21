export class ApiResponse {

    constructor({ success = false, message = "Something went wrong", data = null, errorDetails = "Error" }) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorDetails = errorDetails;
    }

    get isSuccess() {
        return this.success === true;
    }

    get isError() {
        return this.success === false;
    }
}  
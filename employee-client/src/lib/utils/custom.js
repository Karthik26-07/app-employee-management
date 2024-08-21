import SecureStorageService from "../store/secure-store";

export const formateDate = (value) => {
    const date = new Date(value);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}
export const customDateFormate = (value) => {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, pad with leading zero
    const day = String(date.getDate()).padStart(2, "0"); // Pad day with leading zero
    return `${year}-${month}-${day}`;
}

export const setImage = (path) => {
    SecureStorageService.setItem("image", path)
}
export const getImage = () => {
    SecureStorageService.getItem("image")
}



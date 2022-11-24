import moment from "moment";
// Display Money in Dollar Format
export const displayMoney = (n) => {
  const numFormat = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
  });

  const formated = "$" + numFormat.format(n).split(",", 1)[0].replace(".", ",");
  return formated;
};

// Calculate Discount Percentage
export const calculateDiscount = (discountedPrice, originalPrice) => {
  const discountedPercent = (discountedPrice / originalPrice) * 100;

  return Math.round(discountedPercent);
};

// Calculate Total Amount
export const calculateTotal = (arr) => {
  const total = arr.reduce((accum, val) => accum + val, 0);

  return total;
};

export const createdAt = () => {
  const today = new Date();
  const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + day;
  const hour =
    today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  const minute =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
  const second =
    today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
  const time = hour + ":" + minute + ":" + second;
  const seconds = new Date() / 1000;
  return { date, time, seconds };
};

export const groupByKey = (array, key) => {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
};

export const sortArray = (array) => {
  let arrayIn = [].concat.apply([], array);
  let parsedDates = new Map(
    arrayIn.map((e) => [
      e,
      moment(e.createdAt.date + " " + e.createdAt.time, "YYYY-MM-DD hh:mm:ss"),
    ])
  );

  const arrayOut = arrayIn.sort(
    (a, b) => parsedDates.get(b) - parsedDates.get(a)
  );

  return arrayOut;
};

export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    if (!file) {
      alert("Please select an image");
    } else {
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    }
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const urlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

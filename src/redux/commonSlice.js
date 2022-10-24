import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "commonSlice",
  initialState: {
    isAddProd: false,
    isEditProd: false,
    productStep: 1,
    currentUploaded: [],
    productDetails: {
      id: null,
      heroImage: "",
      images: [],
      brand: "",
      category: "",
      connectivity: "",
      finalPrice: null,
      info: "",
      originalPrice: null,
      path: "/product-details/",
      quantity: null,
      rateCount: null,
      ratings: null,
      stock: null,
      tag: "",
      tagline: "",
      title: "",
      type: "",
    },
    isProductForm: true,
  },
  reducers: {
    setProductDetails: (state, action) => {
      /* (field, value) */
      switch (action.payload.field) {
        case "id":
          state.productDetails.id = action.payload.value;
          break;
        case "heroImage":
          state.productDetails.heroImage = action.payload.value;
          break;
        case "images":
          state.productDetails.images = [
            ...state.productDetails.images,
            action.payload.value,
          ];
          break;
        case "brand":
          state.productDetails.brand = action.payload.value;
          break;
        case "category":
          state.productDetails.category = action.payload.value;
          break;
        case "connectivity":
          state.productDetails.connectivity = action.payload.value;
          break;
        case "finalPrice":
          state.productDetails.finalPrice = action.payload.value;
          break;
        case "originalPrice":
          state.productDetails.originalPrice = action.payload.value;
          break;
        case "path":
          state.productDetails.path = action.payload.value;
          break;
        case "quantity":
          state.productDetails.quantity = action.payload.value;
          break;
        case "rateCount":
          state.productDetails.rateCount = action.payload.value;
          break;
        case "ratings":
          state.productDetails.ratings = action.payload.value;
          break;
        case "stock":
          state.productDetails.stock = action.payload.value;
          break;
        case "tag":
          state.productDetails.tag = action.payload.value;
          break;
        case "tagline":
          state.productDetails.tagline = action.payload.value;
          break;
        case "title":
          state.productDetails.title = action.payload.value;
          break;
        case "type":
          state.productDetails.type = action.payload.value;
          break;
        case "info":
          state.productDetails.info = action.payload.value;
          break;
        default:
          console.log("error");
      }
    },
    clearProductDetails: (state) => {
      state.currentUploaded = [];
      state.productDetails = {
        brand: "",
        category: "",
        connectivity: "",
        finalPrice: null,
        heroImage: "",
        images: [],
        id: null,
        info: "",
        originalPrice: null,
        path: "",
        quantity: null,
        rateCount: null,
        ratings: null,
        stock: null,
        tag: "",
        tagline: "",
        title: "",
        type: "",
      };
    },
    setCurrentUploaded: (state, action) => {
      state.currentUploaded = action.payload;
    },
    setActiveStep: (state, action) => {
      state.productStep = action.payload;
    },
    toggleProductForm: (state, action) => {
      state.isProductForm = action.payload;
    },
    toggleAddProduct: (state, action) => {
      state.isAddProd = action.payload;
    },
    toggleEditProduct: (state, action) => {
      state.isEditProd = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentUploaded,
  setProductDetails,
  setActiveStep,
  toggleProductForm,
  toggleAddProduct,
  toggleEditProduct,
} = commonSlice.actions;

export default commonSlice.reducer;

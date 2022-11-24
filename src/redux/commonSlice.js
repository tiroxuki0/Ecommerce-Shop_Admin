import { createSlice } from "@reduxjs/toolkit";

export const commonSlice = createSlice({
  name: "commonSlice",
  initialState: {
    addLoading: false,
    pending: false,
    orderSelected: null,
    userSelected: null,
    productSelected: null,
    isAddProd: false,
    isImagesManager: { status: false, from: null },
    imagesSelectedFromManager: null,
    productStep: 0,
    productDetails: {
      id: null,
      heroImage: { path: null, src: null },
      images: [],
      brand: null,
      category: null,
      connectivity: null,
      finalPrice: null,
      info: null,
      originalPrice: null,
      path: "/product-details/",
      quantity: null,
      rateCount: null,
      ratings: null,
      stock: null,
      tag: null,
      tagline: null,
      title: null,
      type: null,
    },
    registerDetails: {
      uid: null,
      username: null,
      email: null,
      password: null,
      providerId: "normal",
      photoURL: null,
      idDB: null,
      admin: false,
    },
    isProductForm: false,
    isUserForm: false,
    isOrderPreview: false,
  },
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    clearProductDetails: (state) => {
      state.productSelected = null;
      state.isAddProd = false;
      state.productStep = 0;
      state.currentUploaded = [];
      state.isProductForm = false;
      state.productDetails = {
        brand: null,
        category: null,
        connectivity: null,
        finalPrice: null,
        heroImage: { path: null, src: null },
        images: [],
        id: null,
        info: null,
        originalPrice: null,
        path: "/product-details/",
        quantity: null,
        rateCount: null,
        ratings: null,
        stock: null,
        tag: null,
        tagline: null,
        title: null,
        type: null,
      };
    },
    setPending: (state, action) => {
      state.pending = action.payload;
    },
    setAddLoading: (state, action) => {
      state.addLoading = action.payload;
    },
    setProductHeroImage: (state, action) => {
      state.productDetails.heroImage = action.payload;
    },
    setProductImages: (state, action) => {
      state.productDetails.images = action.payload;
    },
    setActiveStep: (state, action) => {
      state.productStep = action.payload;
    },
    setProductSelected: (state, action) => {
      state.productSelected = action.payload;
    },
    setUserSelected: (state, action) => {
      state.userSelected = action.payload;
    },
    setOrderSelected: (state, action) => {
      state.orderSelected = action.payload;
    },
    setImagesSelectedFromManager: (state, action) => {
      state.imagesSelectedFromManager = action.payload;
    },
    toggleImagesManager: (state, action) => {
      state.isImagesManager = action.payload;
    },
    toggleProductForm: (state, action) => {
      state.isProductForm = action.payload;
    },
    toggleUserForm: (state, action) => {
      state.isUserForm = action.payload;
    },
    toggleOrderPreview: (state, action) => {
      state.isOrderPreview = action.payload;
    },
    toggleAddProduct: (state, action) => {
      state.isAddProd = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProductHeroImage,
  setProductImages,
  setProductDetails,
  setUserSelected,
  setActiveStep,
  setOrderSelected,
  toggleProductForm,
  toggleImagesManager,
  toggleAddProduct,
  toggleUserForm,
  toggleOrderPreview,
  clearProductDetails,
  setProductSelected,
  setPending,
  setAddLoading,
} = commonSlice.actions;

export default commonSlice.reducer;

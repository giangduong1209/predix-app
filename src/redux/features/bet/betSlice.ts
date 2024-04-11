import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IBetSliceState {
  bettedStatus: string;
}

const initialState: IBetSliceState = {
  bettedStatus: "UnBetted",
};

export const betSlice = createSlice({
  name: "bet",
  initialState,
  reducers: {
    changeBettedStatusHandler: (state, actions: PayloadAction<string>) => {
      state.bettedStatus = actions.payload;
    },
    resetState: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { changeBettedStatusHandler, resetState } = betSlice.actions;

export default betSlice.reducer;

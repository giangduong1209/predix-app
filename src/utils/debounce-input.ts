import { debounce } from "lodash";

export const debounceInput = debounce(
  (text: string, onChangeText?: (text: string) => void) => {
    onChangeText?.(text);
  },
  200
);

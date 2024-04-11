import { axiosClient } from "@/lib/axios-client";

interface INicknamePara {
  user_address: string;
  nickname: string;
  recommend_id?: string;
}

const userApi = {
  nickname(value: INicknamePara): Promise<any> {
    const url = `/user/create`;
    return axiosClient.post(url, { ...value });
  },
};

export default userApi;

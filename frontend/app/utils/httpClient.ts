import axios from "axios";
import { KLine } from "./types";

const BASE_URL = "http://localhost:3000/api/v1";

export async function getKlines(
  market: string,
  interval: string,
  startTime: string,
  endTime: string
) {
  try {
    const response = await axios.get(
      `${BASE_URL}/klines?sybol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
    );

    const data: KLine[] = response.data;

    return data.sort((x, y) => Number(x.end) - Number(y.end));
  } catch (error) {
    console.error(error);
    return [];
  }
}

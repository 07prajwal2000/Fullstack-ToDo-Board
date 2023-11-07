import axios from "axios";

const baseUrl = 'http://localhost:3001';

const httpClient = axios.create({
  baseURL: baseUrl,
});

export const GetFetcher = httpClient.get;
export const PostFetcher = httpClient.post;
export const PutFetcher = httpClient.put;
export const DeleteFetcher = httpClient.delete;
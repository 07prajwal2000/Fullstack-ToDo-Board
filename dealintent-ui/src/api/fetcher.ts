import axios from "axios";

const baseUrl = 'https://dealintent-assignment.up.railway.app/';

const httpClient = axios.create({
  baseURL: baseUrl,
});

export const GetFetcher = httpClient.get;
export const PostFetcher = httpClient.post;
export const PutFetcher = httpClient.put;
export const DeleteFetcher = httpClient.delete;
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useQuery as useQueryOriginal,
  useMutation as useMutationOriginal,
  useQueryClient as useQueryClientOriginal,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
  QueryKey,
  QueryClient as QueryClientType,
} from "@tanstack/react-query";

// Simple re-exports — no SSR workaround needed since all consumers are client components
// wrapped in QueryClientProvider via Providers.

function useQuery<TQueryFnData, TError, TData>(
  options: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> {
  return useQueryOriginal(options) as any;
}

function useMutation<TData, TError, TVariables, TContext>(
  options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutationOriginal(options as any) as any;
}

function useQueryClient(): QueryClientType {
  return useQueryClientOriginal();
}

export {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
};
export type {
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
  QueryKey,
};

import {  useGetCompanyContextQuery } from "./tanantApi";

export const useTenantContext = () => {

  const { data ,isLoading} = useGetCompanyContextQuery();

  return {
    membership_id : data?.data?.membership_id,
    company: data?.data?.company,
    role: data?.data?.role,
    permissions: data?.data?.permissions || [],
    subscription: data?.data?.subscription,
    isLoading
  };

};
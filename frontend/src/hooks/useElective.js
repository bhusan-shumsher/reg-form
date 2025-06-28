import { useQuery } from "@tanstack/react-query";

import { getElective } from "../services/apiSubject";

export function useElective(){
    const {data,isLoading,isError,error} = useQuery({
        queryKey: ['listElective'],
        queryFn: getElective,
    });
    return {data,isLoading,isError,error};

};
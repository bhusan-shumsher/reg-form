import {useQuery} from '@tanstack/react-query';
import {filterByRegistration} from '../../services/apiAdmin';

export function useFilterByRegistration({faculty,type}){
    const {data,isLoading,isError,error} = useQuery({
        queryKey: ['filterRegistration',faculty,type],
        queryFn: ()=>filterByRegistration({faculty,type})
    });
    return {data,isLoading,isError,error};
}
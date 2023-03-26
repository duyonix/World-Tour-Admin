import { useState, useEffect, useCallback } from "react";

type Props = {
  params: string;
  func: any;
  valueProp: string;
  totalProp: string;
};

const useFetch = ({
  params,
  func,
  valueProp = "rows",
  totalProp = "count"
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [reFetch, setReFetch] = useState<boolean>(false);

  const sendQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const result = await func.call(this, JSON.parse(params));
      setList(result[valueProp] || []);
      setLoading(false);
      setTotal(result[totalProp] || 0);
    } catch (error) {
      setLoading(false);
      setError(false);
    }
  }, [params, func, valueProp, totalProp]);

  useEffect(() => {
    const fetchData = async () => {
      await sendQuery();
    };
    fetchData();
  }, [reFetch, sendQuery]);

  return {
    loading,
    error,
    list,
    total,
    onReFetch: () => setReFetch(!reFetch)
  };
};

export default useFetch;

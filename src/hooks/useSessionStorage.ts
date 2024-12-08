import { useState, useEffect } from "react";

type SetValue<T> = (value: T) => void;

const useSessionStorage = <T>(key: string, value: T): [T, SetValue<T>] => {
    const [sessionValue, setSessionValue] = useState(value);

    useEffect(() => {
        const item = sessionStorage.getItem(key);
        if (item) {
            setSessionValue(JSON.parse(item));
        }
    }, [key]);

    const setValue = (val: T) => {
        setSessionValue(val);
        sessionStorage.setItem(key, JSON.stringify(val));
    };

    return [sessionValue, setValue];
};

export default useSessionStorage;

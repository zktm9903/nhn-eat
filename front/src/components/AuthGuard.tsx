import { ReactNode, useEffect, useState } from "react";
import { apiClient } from "../apis/apiClient";
import { signUp } from "../apis/user";
import { useQuery } from "@tanstack/react-query";

export function AuthGuard({ children }: { children: ReactNode }) {
  const [guard, setGuard] = useState(false);

  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response.status);
      if (error.response.status === 401) setGuard(true);
      return Promise.reject(error);
    }
  );

  return <>{guard ? <SignUpPage setGuard={setGuard} /> : children}</>;
}

function SignUpPage({
  setGuard,
}: {
  setGuard: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const signUpQuery = useQuery({ queryKey: [], queryFn: signUp });

  useEffect(() => {
    if (signUpQuery.isSuccess) {
      setGuard(false);
    }
  }, [signUpQuery.isSuccess]);

  return <p>👮‍♀️ Signing up... </p>;
}

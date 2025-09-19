import { useEffect } from "react";
import { useRouter } from "next/router";
import { RootStore, useAppSelector } from "../store/store";
import { useSelector } from "react-redux";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = (props) => {
  const router = useRouter();
  const isAuth = useAppSelector((state: RootStore) => state.admin.isAuth);

  useEffect(() => {
    // Don't redirect if we're already on auth pages
    const currentPath = router.pathname;
    const authPages = ['/', '/Login', '/Registration'];
    
    if (!isAuth && !authPages.includes(currentPath)) {
      router.push("/");
    }
  }, [isAuth, router]); // ✅ Added isAuth dependency

  return <>{props.children}</>;
};

export default AuthCheck;
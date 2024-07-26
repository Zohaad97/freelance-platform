import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/services/user';

const AuthCheck = ({ children }: { children: JSX.Element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const userStore = useUserStore()
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log({ user, isLoading })
            if (user) {
                setIsLoading(false);
                userStore.signIn({ id: user.uid, name: user.displayName || "" })
            } else {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // You can replace this with your loading component
    }

    return <>{children}</>;
};

export default AuthCheck;

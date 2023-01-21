import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"


export default function useLoginState() {
  const [loginInformation, setLoginInformation] = useState({
    isLoggedIn: false,
    user: null,
  });

  const navigate = useNavigate();

  const statusUpdate = useEffect(() => {
    console.log('updated?', loginInformation);
    if (loginInformation.isLoggedIn) navigate('/cards')
  }, [loginInformation])

  /**
   *
   * @param {{
   * username: string | null,
   * email?: string | null,
   * avatar?: string | null,
   * name?: string | null,
   * userId: string | null,
   * }} user
   */
  const updateLogin = async (user) => {
    console.log('user from function', user)
    // const defaultUser = {
    //   username,
    //   email,
    //   avatar,
    //   name,
    //   userId: undefined,
    // };
    setLoginInformation({
      isLoggedIn: user.userId !== null,
      // isLoggedIn: true,
      // user: { ...defaultUser, user, userId: user.id},
      user: {
        email: user.email, 
        userId: user.id
      }
    });
    console.log('loginInformation after set', loginInformation)

    return loginInformation;
  };

  return {
    // isLoggedIn: loginInformation.isLoggedIn,
    // user: loginInformation.user,
    updateLogin,
    statusUpdate
  }
}

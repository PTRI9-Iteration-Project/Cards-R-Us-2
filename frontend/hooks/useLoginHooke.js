import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router';

export default function useLoginState() {
  const [loginInformation, setLoginInformation] = useState({
    isLoggedIn: false,
    user: null,
  });

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
    const defaultUser = {
      username: null,
      email: null,
      avatar: null,
      name: null,
      userId: null,
    };

    setLoginInformation({
      isLoggedIn: user?.userId !== null,
      user: { ...defaultUser, user, userId: user.id },
    });
  };

  return {
    isLoggedIn: loginInformation.isLoggedIn,
    user: loginInformation.user,
    updateLogin,
  };
}
//user?.userId !== null
// { ...defaultUser, user, userId: user.id }

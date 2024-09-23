'use server';

import { z } from 'zod';
import { signUpSchema } from './SignUpForm';
import { prisma } from '@/lib/prisma';
import { Argon2id } from 'oslo/password';
import { lucia } from '@/lib/lucia';
import { cookies } from 'next/headers';
import { signInSchema } from './SignInForm';
import { redirect } from 'next/navigation';
import { generateCodeVerifier, generateState } from 'arctic';
import { googleOAuthClient } from '@/lib/googleOauth';

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  try {
    // If user already exists, throw an error
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return {
        error: 'User already exists',
        success: false,
      };
    }

    const hashedPassword = await new Argon2id().hash(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword: hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});

    const sessionCookie = await lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: 'Something went wrong',
      success: false,
    };
  }
};

export const signIn = async function (value: z.infer<typeof signInSchema>) {
  const user = await prisma.user.findUnique({
    where: {
      email: value.email,
    },
  });

  if (!user) {
    return {
      error: 'User not found',
      success: false,
    };
  }

  if (!user.hashedPassword) {
    return {
      error: 'Invalid password',
      success: false,
    };
  }

  const passwordMatch = await new Argon2id().verify(
    user.hashedPassword,
    value.password
  );

  if (!passwordMatch) {
    return {
      error: 'Invalid password',
      success: false,
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return {
    success: true,
  };
};

export const logout = async () => {
  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('authenticate');
};

export const getGoogleOAuthConsentUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ['openid', 'email', 'profile'],
      }
    );

    cookies().set('codeVerifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    cookies().set('state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true, url: url.toString() };
  } catch (error) {
    return { success: false, error: 'Something went wrong' };
  }
};

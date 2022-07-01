import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { useAuth } from "contexts/auth.context";

const surveyMapper: Record<string, { url: string, name: number, mobile: number, institution_name: number }> = {
  'rehabilitasi-medis': {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSc-Pq5qVTpmNQCdUwN_DJYr41Uriq5MHaoWVnWT8Dw_6oTkFA/viewform',
    name: 1504414483,
    mobile: 101828132,
    institution_name: 712091609,
  },
  'smart-hospital': {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSfuESzpWNGFBdP0oU159kNcooCnTJb4Xh52bJUlBYPJqecRBQ/viewform',
    name: 1504414483,
    mobile: 101828132,
    institution_name: 712091609,
  },
};

const SurveyRedirection: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAuth();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace({
        pathname: "/login",
        query: { returnUrl: router.asPath },
      });
    } else if (isInitialized && isAuthenticated) {
      const { title } = router.query;
      if (typeof title === 'string' && surveyMapper[title]) {
        const sm = surveyMapper[title];
        window.location.href = `${sm.url}?usp=pp_url&entry.${sm.name}=${encodeURIComponent(user?.name || '')}&entry.${sm.mobile}=${encodeURIComponent(user?.mobile || '')}&entry.${sm.institution_name}=${encodeURIComponent(user?.institution_name || '')}`;
      } else {
        router.push('/');
      }
    }
  }, [router, isInitialized, isAuthenticated, user]);

  return (
    <div>loading</div>
  );
}

export default SurveyRedirection;
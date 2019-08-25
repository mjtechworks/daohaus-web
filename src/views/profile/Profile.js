import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import { getProfile } from "3box/lib/api";

import { get } from "../../util/requests";
import DaoList from "../../components/daoList/DaoList";
import ApplicationShortList from "../../components/applicationList/ApplicationShortList";

const Profile = () => {
  const context = useWeb3Context();
  const [molochs, setMolochs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const daoRes = await get(`moloch/`);
      setMolochs(
        daoRes.data.filter(moloch => {
          return moloch.summonerAddress === context.account;
        })
      );

      const applicationRes = await get(`applications/${context.account}`);
      setApplications(applicationRes.data);

      const profile = await getProfile(context.account);
      // const profile = await getProfile(context.account);
      console.log("profile", profile);
      setProfile(profile);
    };

    fetchData();
  }, [context.account]);

  return (
    <div className="View">
      <h1>Profile</h1>
      {context.account}

      {/* {profile.image && profile.image[0] ? (
        <img src={profile.image[0].contentUrl} alt="profile" />
      ) : null} */}

      {profile.name ? (
        <p>
          {profile.emoji ? <span>{profile.emoji}{' '}</span> : null}
          {profile.name}
          
        </p>
      ) : null}

      {profile.website ? <a href={profile.website} target="_blank" rel="noreferrer noopener">{profile.website}</a> : null}

      {molochs.length ? (
        <>
          <h2>I am the summoner of these Molochs</h2>
          <DaoList daos={molochs} />
        </>
      ) : null}

      {applications.length ? (
        <>
          <ApplicationShortList applications={applications} />
          <h2>I have applied to these Molochs</h2>
        </>
      ) : null}
    </div>
  );
};

export default Profile;

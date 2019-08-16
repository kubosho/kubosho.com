import React from 'react';
import styled from 'styled-components';

import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';

const Footer = styled.footer`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
`;
const Profile = styled.p``;

export const SiteFooter = (): JSX.Element => (
  <Footer>
    <img src="/static/images/kubosho.jpg" alt="このブログを作った人のアイコン" width="60" height="60" />
    <Profile>
      kuboshoの個人ブログです。仕事で携わっているソフトウェア開発や、ダーツやゲームなどの趣味について書きます。
    </Profile>
  </Footer>
);

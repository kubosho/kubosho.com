import styled from 'styled-components';
import { SPACE } from '../common_styles/space';
import { SUB_COLOR, TEXT_COLOR } from '../common_styles/color';
import { NOTE_FONT_SIZE } from '../common_styles/text';

export const PublishedDate = styled.time`
  display: inline-block;
  padding: calc(${SPACE} / 2) calc(${SPACE} * 6) calc(${SPACE} / 2) 0;
  border-bottom: 4px solid ${SUB_COLOR};
  color: ${TEXT_COLOR};
  font-size: ${NOTE_FONT_SIZE};
`;

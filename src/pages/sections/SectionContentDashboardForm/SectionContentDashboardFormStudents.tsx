import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagicWandSparkles, faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { IContent } from "../SectionContentDashboardPage";

import empty from '../../../assets/images/empty.svg';
import { UserState } from "../../../redux/slices/user";
import { post } from "../../../utils/network";
import InlineReactions from "../../../components/InlineReactions";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface ISectionContentDashboardFormStudentsProps {
  content: IContent[];
  user: UserState;
  courseId: string;
  sectionId: string;
}

export default function SectionContentDashboardFormStudents({ content, user, courseId, sectionId }: ISectionContentDashboardFormStudentsProps) {

  const navigate = useNavigate();

  const urlByProfile = {
    'DIVERGENTE': 'map',
    'ASIMILADOR': 'summary',
    'ACOMODADOR': 'audio',
    'CONVERGENTE': 'game',
    'SIN_PERFIL': '',
  }

  return (content?.length ? <Table
    style={{
      fontSize: '1.8vmin',
    }}
  >
    <thead>
      <tr>
        <th>Contenido</th>
        <th style={{
        }}>¿Qué te parece el contenido?</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {content.map(c => (
        <tr key={c.id}>
          <td>{c.title}</td>
          <td>
           <div style={{
            width: '100%',
            display: 'flex',
           }}>
            <InlineReactions
                contentId={c.id}
                reaction={c.reactions.find(r => r.userId === user.id)?.['isSatisfied']}
              />
           </div>
          </td>
          <td style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}>
            <button className="btn-purple-2"
              onClick={() => {
                navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}?url=${encodeURIComponent(c.presignedUrl)}`);
              }}
            >Ver original</button>
            <button className="btn-purple-1"
              onClick={() => {
                navigate(`/courses/${courseId}/sections/${sectionId}/content/${c.id}/${urlByProfile[user.learningProfile!]}`);
              }}
            >
              <FontAwesomeIcon icon={faMagicWandSparkles} />
              {' '}
              Ver</button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table> : <div className='d-flex flex-column justify-content-center align-items-center h-100'>
    <img
      style={{
        height: '50vh',
      }}
      src={empty}
    ></img>
    <>
      <h3>Todavía no hay contenidos en esta sección.</h3>
      <h4>Intentá más tarde o contactá a tu docente.</h4>
    </>
  </div>)
}

import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBInputGroup,
  MDBInputGroupElement,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LoadingStateEnum from '../../helpers/enums/LoadingStateEnum';
import SelectedScopeEnum from '../../helpers/enums/SelectedScopeEnum';
import SimplifiedUser from '../../helpers/responseInterfaces/SimplifiedUser';
import { useAppSelector } from '../../redux/hooks';
import { fetchFromTask, addToProject } from '../../redux/slices/UsersSlice';

const MembersTab = () => {
  const scopeSelected = useAppSelector((state) => state.logged.scope);
  const dispatch = useDispatch();
  const users = useAppSelector((state) => state.users.users);
  const selected = useAppSelector((state) => state.projects.selected);
  const loadingState = useAppSelector((state) => state.users.loading);
  const [search, setSearch] = useState('');
  const submit = () => {
    const splited: string[] = search.split(' ');
    dispatch(
      addToProject({
        name: splited[0],
        surname: splited[1],
        idProject: selected,
      })
    );
  };

  useEffect(() => {
    if (scopeSelected === SelectedScopeEnum.PROJECT)
      dispatch(fetchFromTask(selected));
  }, [dispatch, scopeSelected, selected]);

  return (
    <Fragment>
      <MDBInputGroup className="mb-2 shadow">
        <MDBInputGroupElement
          onChange={(e: any) => setSearch(e.target.value)}
          type="text"
          placeholder="find by name"
        />
        <MDBBtn onClick={() => submit()} outline color="success">
          {loadingState !== LoadingStateEnum.PENDING && 'add'}
          {loadingState === LoadingStateEnum.PENDING && (
            <MDBSpinner grow color="success" size="sm">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          )}
        </MDBBtn>
      </MDBInputGroup>
      <MDBContainer className="w-100 h-80 overflow-auto shadow-sm position-relative">
        {users.map((user: SimplifiedUser, key: number) => {
          return (
            <MDBRow key={key} between className=" border">
              <MDBCol size="3 px-0">
                <img
                  alt="placeholder"
                  className="img-fluid w-100 h-100"
                  src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg"
                />
              </MDBCol>
              <MDBCol center size="8" className="justify-center h-100">
                <h6 className="m-0 mt-2">
                  {user.name} {user.surname}
                </h6>
                <p className="m-0 mb-2">
                  <small>CEO</small>
                </p>
              </MDBCol>
            </MDBRow>
          );
        })}
      </MDBContainer>
    </Fragment>
  );
};

export default MembersTab;

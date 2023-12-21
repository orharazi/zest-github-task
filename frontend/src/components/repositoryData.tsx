/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  Col,
  Image,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { createFavorite, deleteFavorite } from "../slices/favorites.slice";
import { RepoSearchResultItem } from "../types/repositories.type";
import { fetchData } from "../utils/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { tabTitles } from "../types/types";

interface RepositoryDataComponentProps {
  currentTab: tabTitles;
  search: string;
}

interface AccordionBodyComponentProps {
  repoId: number;
  repo: RepoSearchResultItem | null;
}

function RepositoryData({ currentTab, search }: RepositoryDataComponentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const clickedId = useRef<number | null>(null);
  const isFavorites = currentTab === "favorites";

  // Get data from states
  const { entities: repositories } = useSelector(
    (state: RootState) => state.repositories
  );

  const { entities: favorites, status: favStatus } = useSelector(
    (state: RootState) => state.favorites
  );

  // We search bar to filter the favorites, here we handle
  const visibleFavorites = useMemo(() => {
    return search.length > 0 && isFavorites
      ? favorites.filter((_) => _.repoName?.includes(search))
      : favorites;
  }, [search, favorites]);

  // Current data according the tab
  const dataToShow = isFavorites ? visibleFavorites : repositories;

  /**
   * This function handles click on favorite icon, adding or removing favorite repo
   * @param isFav boolean
   * @param repoId number
   * @param repoName string
   */
  const onCheck = (isFav: boolean, repoId: number, repoName: string) => {
    const params = {
      endpoint: `favorites/${isFav ? "deleteFavorite" : "addFavorite"}`,
      params: {
        repoId,
        repoName,
      },
    };
    dispatch(isFav ? deleteFavorite(params) : createFavorite(params));
  };

  return (
    <Accordion>
      {dataToShow.map((repo: any, idx) => {
        const repoName = repo.repoName || repo.name;
        const repoId = repo.repoId || repo.id;
        const isFav = isFavorites || favorites.some((_) => _.repoId == repoId);

        return (
          <Accordion.Item eventKey={`${idx}`} key={idx}>
            <Accordion.Header>
              <Row style={{ width: "100%" }}>
                <Col sm={9} md={10} lg={10} xl={10}>
                  <h4 style={{ margin: 0, whiteSpace: "normal" }}>
                    {repoName}
                  </h4>
                </Col>
                <Col sm={3} md={2} lg={2} xl={2}>
                  {favStatus === "loading" && repoId === clickedId.current ? (
                    <Spinner animation="grow" variant="danger" />
                  ) : (
                    <Image
                      onClick={() => {
                        onCheck(isFav, repoId, repoName);
                        clickedId.current = repoId;
                      }}
                      src={`${!isFav ? "no-" : ""}fav-icon.png`}
                      height={30}
                      width={30}
                      style={{ justifyContent: "flex-end" }}
                    ></Image>
                  )}
                </Col>
              </Row>
            </Accordion.Header>
            <AccordionBody
              repoId={repoId}
              repo={
                // Tring to avoid api call to github
                isFavorites ? repositories.find((_) => _.id == repoId) : repo
              }
            />
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default RepositoryData;

function AccordionBody({ repoId, repo }: AccordionBodyComponentProps) {
  const [repoData, setRepoData] = useState<RepoSearchResultItem | null>(null);

  useEffect(() => {
    // Get data of favorite repo (because we only have its "id" and "?name")
    const fetchDataAndSetState = async () => {
      try {
        const repoDataFromGit = await fetchData(3000, "github/repository", {
          params: {
            id: repoId,
          },
        });
        setRepoData(repoDataFromGit.data as RepoSearchResultItem);
      } catch (e) {
        console.error(`Error while fetching repoData: ${e}`);
      }
    };

    // Setup repo data
    if (!repo) {
      fetchDataAndSetState();
    } else {
      setRepoData(repo);
    }
  }, [repoId]);

  return (
    <Accordion.Body style={{ whiteSpace: "normal" }}>
      {repoData ? (
        <ListGroup>
          <ListGroup.Item>
            <strong>stars:</strong> {repoData.watchers}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>owner:</strong> {repoData.owner?.login}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>url:</strong> {repoData.html_url}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>description:</strong> {repoData.description}
          </ListGroup.Item>
        </ListGroup>
      ) : (
        <Spinner />
      )}
    </Accordion.Body>
  );
}

import "./App.css";
import { Container, Spinner, Tab, Tabs } from "react-bootstrap";
import SearchBar from "./components/searchBar";
import { useEffect, useRef, useState } from "react";
import { fetchRepos } from "./slices/repositories.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchFavorites } from "./slices/favorites.slice";
import InfiniteScroll from "react-infinite-scroll-component";
import RepositoryData from "./components/repositoryData";
import { tabTitles, tabTitlesArr } from "./types/types";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState<string>("");
  const gotUserFavoritesRef = useRef<boolean>(false);
  const [currentTab, setCurrentTab] = useState<tabTitles>("repositories");
  const page = useRef<number>(1);
  const timer = useRef<NodeJS.Timeout | null>();

  // Get data from states
  const { entities: repositories, error: repoError } = useSelector(
    (state: RootState) => state.repositories
  );

  const { error: favError } = useSelector(
    (state: RootState) => state.favorites
  );

  // Remove search when moving between tabs
  useEffect(() => setSearch(""), [currentTab]);

  useEffect(() => {
    // Prevent the last call to api, because another one is going to be execute.
    // Read the description below for more information
    if (timer.current) {
      clearTimeout(timer.current);
    }

    // If "search" has changed, set page to 1
    // setPage(1);
    page.current = 1;

    /* 
      In the first render, we want to get top repositories and user's favorite repositories.
      But we want to make a request when "search" changed to get top repositories.
      So we do all this inside useEffect that triggers when "search" changed,
      but we also doesn't what to call on every change, only when the user stopped typing,
      so this is whay we have the setTimeout.
      The condition that determine the timeout is there in order to make the first requests ASAP, 
      not like the calls with search param.
      But because we dosen't want to call "fetchFavorites" every time but only once, 
      the function is wrapped with condition that trigger it only once
      
      so - here we call them both
    */

    timer.current = setTimeout(
      () => {
        dispatchRepos();

        // Here we make this function to run only once
        if (!gotUserFavoritesRef.current) {
          dispatch(
            fetchFavorites({
              endpoint: "favorites",
            })
          );
          gotUserFavoritesRef.current = true;
        }
      },
      search ? 800 : 0
    );
  }, [search]);

  /**
   *   For pagination, we use third-party lib that create infinity-scroll component,
   * It gets function and trigger it when he assume that we need more data.
   * This function make the calls
   */
  const fetchMoreRepo = () => {
    page.current = page.current + 1;
    dispatchRepos();
  };

  const dispatchRepos = () => {
    dispatch(
      fetchRepos({
        endpoint: "github/top-repositories",
        params: {
          page: page.current,
          repoName: search,
        },
      })
    );
  };

  return (
    <Container className="sticky-top">
      <h1>Zest - Github Repositories App</h1>

      <SearchBar search={search} setSearch={setSearch} />

      <Tabs
        defaultActiveKey="repositories"
        id="app-tab"
        className="mb-3"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelect={(_, e: any) => {
          setCurrentTab(`${e.currentTarget.innerText}` as tabTitles);
        }}
      >
        {tabTitlesArr.map((sectionName) => {
          return (
            <Tab eventKey={sectionName} title={sectionName} key={sectionName}>
              {sectionName === "repositories" ? (
                <>
                  {repoError ? (
                    <p>{repoError}</p>
                  ) : (
                    <InfiniteScroll
                      dataLength={repositories.length}
                      next={fetchMoreRepo}
                      hasMore={repositories.length < 100}
                      loader={<Spinner className="mb-3" />}
                      scrollableTarget="app-tab-tabpane-repositories"
                    >
                      <RepositoryData currentTab={currentTab} search={search} />
                    </InfiniteScroll>
                  )}
                </>
              ) : favError ? (
                <p>{favError}</p>
              ) : (
                <RepositoryData currentTab={currentTab} search={search} />
              )}
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}

export default App;

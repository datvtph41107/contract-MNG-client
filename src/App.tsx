import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { Fragment } from "react";
import DefaultLayout from "~/layouts/DefaultLayout";
import { publicRoutes } from "./routes/routes";
import NotFound from "./page/404Page";

function App() {
    return (
        <Router>
            <div className="App">
                {/* {loading && <LoadingRedirect title="Loading..." />} */}
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    <Route
                        path="*"
                        element={
                            <DefaultLayout>
                                <NotFound />
                            </DefaultLayout>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}
export default App;

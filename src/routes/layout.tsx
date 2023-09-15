// This is the main layout of our app. It renders the header and the footer.

import { Head, Link, StyledLink, Layout } from "rakkasjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpcClient } from "@/utils/client";
import { trpc } from "@/utils/trpc";

import "./index.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout: Layout = ({ children }) => {
const [queryClient] = useState(() => new QueryClient());


  
 return (
   <>
     {/* Rakkas relies on react-helmet-async for managing the document head */}
     {/* See their documentation: https://github.com/staylor/react-helmet-async#readme */}
     <Head title="Rakkas Demo App" />

     <header className="bg-secondary w-full flex  justify-between p-2 sticky top-0 border-b">
       {/* <Link /> is like <a /> but it provides client-side navigation without full page reload. */}
       <Link className="text-3xl gont-bold text-primary" href="/">
         Rakkas Demo App
       </Link>

       <nav className="flex  justify-between">
         <ul className="flex w-full gap-2 px-2">
           <li>
             {/* <StyledLink /> is like <Link /> but it can be styled based on the current route ()which is useful for navigation links). */}
             <StyledLink href="/" activeClass="text-accent">
               Home
             </StyledLink>
           </li>
     
         </ul>
       </nav>
     </header>

     <trpc.Provider client={trpcClient()} queryClient={queryClient}>
       <QueryClientProvider client={queryClient}>
         <section className="min-h-screen h-full w-full  ">{children}</section>
       </QueryClientProvider>
     </trpc.Provider>

     <ToastContainer
       position="bottom-right"
       autoClose={3000}
       hideProgressBar={false}
       newestOnTop={false}
       closeOnClick
       rtl={false}
       pauseOnFocusLoss
       draggable
       pauseOnHover
       theme="dark"
     />
     <footer className="w-full border-t flex flex-col p-2">
       <p>
         Software and documentation: Copyright 2021 Fatih Aygün. MIT License.
       </p>

       <p>
         Favicon: “Flamenco” by{" "}
         <a href="https://thenounproject.com/term/flamenco/111303/">
           gzz from Noun Project
         </a>{" "}
         (not affiliated).
         <br />
         Used under{" "}
         <a href="https://creativecommons.org/licenses/by/2.0/">
           Creative Commons Attribution Generic license (CCBY)
         </a>
       </p>
     </footer>
   </>
 );};

export default MainLayout;

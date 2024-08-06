// import Particles from '@tsparticles/react'
import particlesConfig from './config/particlesConfig'
import lightThemeParticles from './config/lightThemeParticles'
import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine } from "@tsparticles/engine";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; 
import { UseSelector, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';




const ParticlsBackground = () => {
    const isDarkTheme = useSelector((state:RootState)=> state.colour.themeDark)
    let particles = particlesConfig;
    if(isDarkTheme == false){
        particles = lightThemeParticles
    }


    const [ init, setInit ] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container:any) => {
        console.log(container);
    };
  return (
     <Particles className="-z-10" options={particles} particlesLoaded={particlesLoaded}></Particles>
  )
}

export default ParticlsBackground

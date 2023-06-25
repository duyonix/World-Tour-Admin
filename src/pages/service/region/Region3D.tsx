import React, { useState, useEffect, useCallback } from "react";
import { useUnityContext } from "react-unity-webgl";
import { Unity } from "react-unity-webgl/distribution/components/unity-component";
import "./style.scss";

const Region3D = () => {
  const [regionId, setRegionId] = useState("");
  const [isNewTabOpened, setIsNewTabOpened] = useState(false);

  const {
    unityProvider,
    isLoaded,
    sendMessage,
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
    addEventListener,
    removeEventListener
  } = useUnityContext({
    loaderUrl: "/Build/Builds.loader.js",
    dataUrl: "/Build/Builds.data",
    frameworkUrl: "/Build/Builds.framework.js",
    codeUrl: "/Build/Builds.wasm"
  });

  useEffect(() => {
    if (isLoaded) {
      const accessToken = localStorage.getItem("access_token") || "";
      sendMessage("MainAppController", "ReceiveAccessToken", accessToken);
    }
    return () => {
      detachAndUnloadImmediate();
    };
  }, [isLoaded, detachAndUnloadImmediate]);

  const handleSetRegionId = useCallback((...parameters) => {
    const event = parameters[0];
    if (typeof event === "string" || typeof event === "number") {
      setRegionId(event.toString());
      setIsNewTabOpened(false);
    }
    return event;
  }, []);

  useEffect(() => {
    if (isLoaded) {
      addEventListener("SetRegionId", handleSetRegionId);
      return () => {
        removeEventListener("SetRegionId", handleSetRegionId);
      };
    }
  }, [isLoaded, addEventListener, removeEventListener, handleSetRegionId]);

  useEffect(() => {
    if (regionId && !isNewTabOpened) {
      const newPageUrl = `/service/regions/${regionId}`;
      const newWindow = window.open(newPageUrl, "_blank");
      if (newWindow) {
        newWindow.opener = null;
        setIsNewTabOpened(true);
      }
    }
  }, [regionId, isNewTabOpened]);

  const elementStyles = {
    height: "calc(100vh - 64px)",
    width: "calc(100vw - 230px)"
  };

  return (
    <div className="region-3d">
      {!isLoaded && (
        <div className="wrapper-loading">
          <div className="loading">
            <div className="boxes">
              <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="box">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="wrapper">
        <Unity
          unityProvider={unityProvider}
          style={{
            display: isLoaded ? "block" : "none",
            ...elementStyles
          }}
        />
      </div>
    </div>
  );
};

export default Region3D;

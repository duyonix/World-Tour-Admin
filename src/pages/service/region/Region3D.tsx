import React, { useState, useEffect, useCallback } from "react";
import { useUnityContext } from "react-unity-webgl";
import { Unity } from "react-unity-webgl/distribution/components/unity-component";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { useLocation } from "react-router-dom";
import "./style.scss";

const Region3D = () => {
  const [regionId, setRegionId] = useState("");
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token") || "";

  const {
    unityProvider,
    isLoaded,
    sendMessage,
    unload,
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
      sendMessage("MainAppController", "ReceiveAccessToken", accessToken);
    }
  }, [isLoaded]);

  useEffect(() => {
    return () => {
      (async () => {
        if (location.pathname !== "/service/regions/3D-mode") {
          await unload(); // Unload the Unity component if the pathname is not /service/regions/3D-mode
        }
      })();
    };
  }, [location.pathname, unload]);

  const handleSetRegionId = useCallback(
    (...parameters: ReactUnityEventParameter[]): ReactUnityEventParameter => {
      const event = parameters[0];
      if (typeof event === "string" || typeof event === "number") {
        setRegionId(event.toString());
      }
      return event;
    },
    []
  );

  useEffect(() => {
    if (isLoaded) {
      addEventListener("SetRegionId", handleSetRegionId);
      return () => {
        removeEventListener("SetRegionId", handleSetRegionId);
      };
    }
  }, [isLoaded, addEventListener, removeEventListener, handleSetRegionId]);

  useEffect(() => {
    if (regionId) {
      const newPageUrl = `/service/regions/${regionId}`;
      const newWindow = window.open(newPageUrl, "_blank");
      if (newWindow) {
        newWindow.opener = null; // Prevent the new window from having access to the current window
      }
    }
  }, [regionId]);

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

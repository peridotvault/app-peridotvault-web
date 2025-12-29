import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faMobile, faGlobe, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CompactFileInput } from "@/shared/components/ui/CompactFileInput";

export interface BuildConfig {
  id: string;
  platform: "windows" | "mac" | "linux" | "android" | "web";
  file: File | null;
  version: string;
  architecture?: "32-bit" | "64-bit" | "arm" | "universal";
  minRequirements?: string;
  recommendedRequirements?: string;
}

interface BuildsTabContentProps {
  builds: BuildConfig[];
  onBuildsChange: (builds: BuildConfig[]) => void;
}

const PLATFORMS = [
  { id: "windows", name: "Windows", icon: faDesktop, architectures: ["32-bit", "64-bit"] },
  { id: "mac", name: "macOS", icon: faDesktop, architectures: ["64-bit", "arm", "universal"] },
  { id: "linux", name: "Linux", icon: faDesktop, architectures: ["32-bit", "64-bit", "arm"] },
  { id: "android", name: "Android", icon: faMobile, architectures: ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"] },
  { id: "web", name: "Web", icon: faGlobe, architectures: [] },
] as const;

export function BuildsTabContent({ builds, onBuildsChange }: BuildsTabContentProps) {
  const [expandedBuilds, setExpandedBuilds] = useState<Set<string>>(new Set());

  const handleAddBuild = (platform: "windows" | "mac" | "linux" | "android" | "web") => {
    const newBuild: BuildConfig = {
      id: Math.random().toString(36).substring(7),
      platform,
      file: null,
      version: "1.0.0",
      architecture: PLATFORMS.find((p) => p.id === platform)?.architectures[0] as any,
    };
    onBuildsChange([...builds, newBuild]);
    setExpandedBuilds(new Set([...expandedBuilds, newBuild.id]));
  };

  const handleRemoveBuild = (buildId: string) => {
    onBuildsChange(builds.filter((b) => b.id !== buildId));
    setExpandedBuilds(new Set([...expandedBuilds].filter((id) => id !== buildId)));
  };

  const handleUpdateBuild = (buildId: string, updates: Partial<BuildConfig>) => {
    onBuildsChange(
      builds.map((b) => (b.id === buildId ? { ...b, ...updates } : b))
    );
  };

  const toggleExpanded = (buildId: string) => {
    setExpandedBuilds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(buildId)) {
        newSet.delete(buildId);
      } else {
        newSet.add(buildId);
      }
      return newSet;
    });
  };

  const getPlatformInfo = (platform: string) => {
    return PLATFORMS.find((p) => p.id === platform);
  };

  return (
    <div className="space-y-8">
      {/* Platform Selection */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Select Platforms</h2>
        <p className="text-sm text-muted-foreground">
          Choose the platforms you want to support and upload build files for each
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PLATFORMS.map((platform) => {
            const hasBuild = builds.some((b) => b.platform === platform.id);
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => !hasBuild && handleAddBuild(platform.id as any)}
                disabled={hasBuild}
                className={`p-6 rounded-lg border-2 transition flex flex-col items-center gap-4 ${
                  hasBuild
                    ? "border-accent bg-accent/10 cursor-default"
                    : "border-border hover:border-accent/50 hover:bg-muted/40"
                }`}
              >
                <FontAwesomeIcon
                  icon={platform.icon}
                  className={`text-3xl ${hasBuild ? "text-accent" : "text-muted-foreground"}`}
                />
                <span className={`font-medium ${hasBuild ? "text-accent" : "text-foreground"}`}>
                  {platform.name}
                </span>
                {hasBuild && (
                  <span className="text-xs text-accent">Build added</span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Build Configurations */}
      {builds.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Build Configurations</h2>

          <div className="space-y-6">
            {builds.map((build) => {
              const platformInfo = getPlatformInfo(build.platform);
              const isExpanded = expandedBuilds.has(build.id);
              const isComplete = build.file && build.version;

              return (
                <div
                  key={build.id}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  {/* Build Header */}
                  <button
                    type="button"
                    onClick={() => toggleExpanded(build.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={platformInfo!.icon}
                        className="text-xl text-accent"
                      />
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">
                          {platformInfo!.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {build.version || "No version"}
                          {build.architecture && ` • ${build.architecture}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isComplete && (
                        <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">
                          Complete
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBuild(build.id);
                        }}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </button>

                  {/* Build Details (Expandable) */}
                  {isExpanded && (
                    <div className="px-8 py-6 border-t border-border space-y-6">
                      {/* Version & Architecture */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Version
                          </label>
                          <input
                            type="text"
                            value={build.version}
                            onChange={(e) => handleUpdateBuild(build.id, { version: e.target.value })}
                            placeholder="1.0.0"
                            className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                        </div>

                        {platformInfo!.architectures.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Architecture
                            </label>
                            <select
                              value={build.architecture || ""}
                              onChange={(e) =>
                                handleUpdateBuild(build.id, {
                                  architecture: e.target.value as any,
                                })
                              }
                              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                            >
                              {platformInfo!.architectures.map((arch) => (
                                <option key={arch} value={arch}>
                                  {arch}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* File Upload */}
                      <CompactFileInput
                        label="Build File"
                        accept={
                          build.platform === "windows"
                            ? ".exe"
                            : build.platform === "android"
                            ? ".apk"
                            : build.platform === "mac"
                            ? ".dmg"
                            : build.platform === "linux"
                            ? ".AppImage"
                            : ".zip"
                        }
                        file={build.file || null}
                        onFileSelect={(file) => handleUpdateBuild(build.id, { file })}
                        helperText={
                          build.platform === "web"
                            ? "Upload ZIP file containing web build"
                            : `Upload ${platformInfo!.name} build file`
                        }
                        required={build.platform !== "web"}
                      />

                      {/* Requirements (optional) */}
                      {build.platform !== "web" && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Minimum Requirements (Optional)
                            </label>
                            <textarea
                              value={build.minRequirements || ""}
                              onChange={(e) =>
                                handleUpdateBuild(build.id, {
                                  minRequirements: e.target.value,
                                })
                              }
                              placeholder="OS: Windows 10&#10;Processor: Intel Core i3&#10;Memory: 4 GB RAM&#10;Graphics: Intel HD Graphics 4000&#10;Storage: 500 MB available space"
                              rows={5}
                              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Recommended Requirements (Optional)
                            </label>
                            <textarea
                              value={build.recommendedRequirements || ""}
                              onChange={(e) =>
                                handleUpdateBuild(build.id, {
                                  recommendedRequirements: e.target.value,
                                })
                              }
                              placeholder="OS: Windows 10/11&#10;Processor: Intel Core i5&#10;Memory: 8 GB RAM&#10;Graphics: NVIDIA GTX 1050&#10;Storage: 1 GB available space"
                              rows={5}
                              className="w-full px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-y"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

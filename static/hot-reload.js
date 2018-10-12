const filesInDirectory = dir =>
  new Promise(resolve =>
    dir.createReader().readEntries(entries =>
      Promise.all(
        entries
          .filter(e => e.name[0] !== ".")
          .map(
            e =>
              e.isDirectory
                ? filesInDirectory(e)
                : new Promise(resolve => e.file(resolve))
          )
      )
        .then(files => [].concat(...files))
        .then(resolve)
    )
  );

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModifiedDate).join()
  );

const reload = () => {
  extension.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) {
      extension.tabs.reload(tabs[0].id);
    }

    extension.runtime.reload();
  });
};

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || lastTimestamp === timestamp) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // retry after 1s
    } else {
      reload();
    }
  });
};

extension.management.getSelf(self => {
  if (self.installType === "development") {
    extension.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
  }
});

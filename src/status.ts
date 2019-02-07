import * as octonode from 'octonode';

export class GithubStatus {
  private fullRepoName: string;
  private commitId: string;
  private host: string;

  constructor(fullRepoName: string, commitId: string, host: string) {
    this.fullRepoName = fullRepoName;
    this.commitId = commitId;
    this.host = host;
  }

  public pending(description: string) {
    return sendGithubStatus(
      'pending',
      description,
      this.fullRepoName,
      this.commitId,
      this.host,
    );
  }

  public success(description: string) {
    return sendGithubStatus(
      'success',
      description,
      this.fullRepoName,
      this.commitId,
      this.host,
    );
  }

  public error(description: string) {
    return sendGithubStatus(
      'success',
      description,
      this.fullRepoName,
      this.commitId,
      this.host,
    );
  }

  public failure(description: string) {
    return sendGithubStatus(
      'failure',
      description,
      this.fullRepoName,
      this.commitId,
      this.host,
    );
  }
}

const sendGithubStatus = (
  state: string,
  description: string,
  fullRepoName: string,
  commitId: string,
  host: string,
) => {
  const client = octonode.client(process.env.GITHUB_TOKEN);
  const ghrepo = client.repo(fullRepoName);

  return new Promise((resolve, reject) => {
    ghrepo.status(
      commitId,
      {
        state,
        description,
        target_url: `http://${host}/build/${commitId}`,
      },
      (err, data, headers) => {
        if (err) {
          reject();
        } else {
          resolve();
        }
      },
    );
  });
};

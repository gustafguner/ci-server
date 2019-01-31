import * as octonode from 'octonode';

export class GithubStatus {
  fullRepoName: string;
  commitId: string;

  constructor(fullRepoName: string, commitId: string) {
    this.fullRepoName = fullRepoName;
    this.commitId = commitId;
  }

  pending(description: string) {
    return sendGithubStatus(
      'pending',
      description,
      this.fullRepoName,
      this.commitId,
    );
  }

  success(description: string) {
    return sendGithubStatus(
      'success',
      description,
      this.fullRepoName,
      this.commitId,
    );
  }

  error(description: string) {
    return sendGithubStatus(
      'success',
      description,
      this.fullRepoName,
      this.commitId,
    );
  }

  failure(description: string) {
    return sendGithubStatus(
      'failure',
      description,
      this.fullRepoName,
      this.commitId,
    );
  }
}

const sendGithubStatus = (
  state: string,
  description: string,
  fullRepoName: string,
  commitId: string,
) => {
  const client = octonode.client(process.env.GITHUB_TOKEN);
  const ghrepo = client.repo(fullRepoName);

  return new Promise((resolve, reject) => {
    ghrepo.status(
      commitId,
      {
        state,
        description,
      },
      function(err, data, headers) {
        if (err) {
          reject();
        } else {
          resolve();
        }
      },
    );
  });
};

<template>
  <div>watchlist</div>
  <!-- <h3>Step 1</h3>
  <button class="btn btn-primary" type="button" @click="getRequestToken">
    create request token
  </button>
  requestToken:{{ requestToken }} -->

  <!-- <h3>Step 2</h3>
  <a
    :href="approvedPageUrl"
    target="blank"
    @click="goToAuthentication"
    class="d-inline-block"
    >authentication</a
  > -->

  <!-- <h3>Step 3</h3>
  <button class="btn btn-primary" type="button" @click="createSessionID">
    create sessionID
  </button>
  sessionID:{{ sessionID }} -->

  <h3>Step 4</h3>
  <button class="btn btn-primary" type="button" @click="createList">
    create List
  </button>
  listResponse:{{ listResponse }}

  <!-- <h3>Step 5</h3>
  <button class="btn btn-primary" type="button" @click="addToWatchList">
    add To WatchList
  </button>
  WatchList:{{ watchListStatus }} -->

  <!-- <h3>Step 6</h3>
  <button class="btn btn-primary" type="button" @click="getMovieWatchList">
    get WatchList
  </button>
  WatchList:{{ watchList }} -->

  <ul v-for="item in watchList" :key="item.id">
    <li>{{ item.title }}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      key: '7bbe6005cfda593dc21cceb93eaf9a8e',
      requestToken: '',
      sessionID: 'd13bca7b7450c217c5af3127e3a0a984db98ccb2',
      approvedPageUrl: '',
      listResponse: '',
      listResponseMessage: '',
      listID: '',
      id: '646385',
      watchListStatus: null,
      watchList: null,
      account_id: 'qqqq5953'
    };
  },
  methods: {
    async getRequestToken() {
      // api
      const api = `https://api.themoviedb.org/3/authentication/token/new?api_key=${this.key}`;
      const response = await this.$http.get(api).catch((err) => {
        console.log(err);
      });

      console.log('getRequestToken', response);

      this.requestToken = response.data.request_token;
    },
    goToAuthentication() {
      this.approvedPageUrl = `https://www.themoviedb.org/authenticate/${this.requestToken}`;
    },
    async createSessionID() {
      // api
      const api = `https://api.themoviedb.org/3/authentication/session/new?api_key=${this.key}`;
      const requestBody = {
        request_token: this.requestToken
      };
      const response = await this.$http.post(api, requestBody).catch((err) => {
        console.log(err);
      });

      console.log('createSessionID', response);

      this.sessionID = response.data.session_id;
    },
    async createList() {
      const api = `https://api.themoviedb.org/3/list?api_key=${this.key}&session_id=${this.sessionID}`;

      const requestBody = {
        name: 'Test 1',
        description: 'Test 1',
        language: 'en'
      };

      const response = await this.$http.post(api, requestBody).catch((err) => {
        console.log(err);
      });

      this.listResponse = response.data.success;
      this.listResponseMessage = response.data.status_message;
      this.listID = response.data.list_code;
      console.log('createList', response);
    },
    async addToWatchList() {
      const api = `https://api.themoviedb.org/3/account/${this.account_id}/watchlist?api_key=${this.key}&session_id=${this.sessionID}`;

      const requestBody = {
        media_type: 'movie',
        media_id: this.id,
        watchlist: true
      };

      const response = await this.$http.post(api, requestBody).catch((err) => {
        console.log(err);
      });

      this.watchListStatus = response;
      console.log('addToWatchList', response);
    },
    async getMovieWatchList() {
      const api = `https://api.themoviedb.org/3/account/${this.account_id}/watchlist/movies?api_key=${this.key}&language=en-US&session_id=${this.sessionID}&sort_by=created_at.asc&page=1`;

      const response = await this.$http.get(api).catch((err) => {
        console.log(err);
      });

      this.watchList = response.data.results;
      console.log('getMovieWatchList', response);
    }
  },
  created() {
    console.log('this.$route', this.$route);
  }
};
</script>

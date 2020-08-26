<template>
  <q-page>
    <!-- jika id diset -->
    <div class="q-pa-md flex flex-center" v-if="$route.params.id">
      <div class="row">
        <div class="col">
          <!-- skeleton -->
          <q-card flat class="row" v-if="loading">
            <div class="col-6">
              <q-card-section>
                <q-skeleton type="text" width="50%" class="text-subtitle1" />
                <q-skeleton type="text" class="text-subtitle1" />
                <q-skeleton type="text" width="50%" class="text-subtitle1" />
                <q-skeleton type="text" class="text-caption" />
              </q-card-section>
            </div>
            <div class="col-6">
              <q-skeleton height="150px" width="350px" square />
            </div>
          </q-card>
          <!-- end skeleton -->
          <div v-if="!loading">
            <q-card class="my-card q-ma-sm" flat bordered>
              <q-card-section horizontal>
                <q-card-section class="col-6 q-pt-xs">
                  <div class="text-overline" v-if="data.masjid !== null">
                    Lokasi : {{ data.masjid.jenis }} {{ data.masjid.nama
                    }}<i v-if="latlong.display_name"
                      >. {{ latlong.display_name }}</i
                    >
                  </div>
                  <div class="text-h5 q-mt-sm q-mb-xs">
                    <q>{{ data.bahasan }}</q>
                  </div>
                  <div
                    class="text-caption text-grey-8"
                    v-if="data.masjid !== null"
                  >
                    {{ data.masjid.profil }}
                  </div>
                </q-card-section>

                <q-card-section
                  class="col-5 flex flex-center"
                  style="height:300px;min-width: 150px;"
                  v-if="data.masjid && latlong.length !== null"
                >
                  <l-map
                    v-if="showMap"
                    :zoom="zoom"
                    :center="center"
                    :options="mapOptions"
                    style="height: 80%"
                    @update:center="centerUpdate"
                    @update:zoom="zoomUpdate"
                  >
                    <l-tile-layer :url="url" :attribution="attribution" />
                    <l-marker :lat-lng="marker">
                      <l-tooltip
                        :options="{ permanent: true, interactive: true }"
                      >
                        <div @click="showParagraph = !showParagraph">
                          {{ latlong.display_name }}
                          <p v-show="showParagraph">
                            Lorem ipsum dolor sit amet.
                          </p>
                        </div>
                      </l-tooltip>
                      <l-icon
                        :icon-size="dynamicSize"
                        :icon-anchor="dynamicAnchor"
                        icon-url="https://image.flaticon.com/icons/svg/3165/3165262.svg"
                      />
                    </l-marker>
                  </l-map>
                </q-card-section>
              </q-card-section>
              <q-card class="my-card q-ma-sm" flat bordered v-if="data.guru">
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="data.guru.foto" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ data.guru.nama }}</q-item-label>
                    <q-item-label caption>
                      {{ data.guru.hp }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />
                <q-card-section class="text-caption text-grey-8">
                  {{ data.guru.profile }}
                </q-card-section>
              </q-card>

              <q-separator />

              <q-card-actions>
                <q-btn flat round icon="event" />
                <q-btn flat>
                  {{ data.jam_mulai }} - {{ data.jam_selesai }}
                </q-btn>
                <q-btn flat color="primary">
                  {{
                    moment(data.tanggal)
                      .locale("id")
                      .format("dddd")
                  }}
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <!-- end jika id diset -->
  </q-page>
</template>
<script>
import { latLng, icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LIcon
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import moment from "moment";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LIcon
  },

  data() {
    return {
      zoom: 13,
      center: [5.339, 95.9686],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      showParagraph: false,
      marker: [5.339, 95.9686],
      currentCenter: [5.339, 95.9686],
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      loading: true,
      data: {},
      latlong: {}
    };
  },
  methods: {
    moment,
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    async loadData() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian/${this.$route.params.id}`)
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    async loadLatLong() {
      await this.$axios
        .get(
          `https://locationiq.org/v1/search.php?key=3d0e63349939df&q=${this.data.masjid.alamat.nama}&format=json`
        )
        .then(response => {
          this.latlong = response.data[0];
          this.center = [this.latlong.lat, this.latlong.lon];
          this.currentCenter = [this.latlong.lat, this.latlong.lon];
          this.marker = [this.latlong.lat, this.latlong.lon];
          console.log(this.latlong.lat + "+" + this.latlong.lon);
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    }
  },
  async created() {
    await this.loadData();
    if (this.data.masjid !== null) {
      this.loadLatLong();
    }
    this.loading = false;
  }
};
</script>

<style lang="sass" src="./Profile.sass" scoped></style>

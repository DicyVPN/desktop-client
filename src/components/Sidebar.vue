<template>
  <div class="bg-gray-600 w-256 h-screen p-8 flex flex-col gap-8 select-none shadow-4-lg">
    <div>
      <AccountSelector @click="account()"/>
      <DropdownSettings :is-open="isOpen"/>
    </div>
    <Status/>
    <div class="sidebar-card h-full p-8 flex flex-col gap-8 w-full overflow-y-auto">
      <p class="ml-8 mt-8 text-small font-light">Server Consigliati</p>
      <div class="flex flex-col gap-y-[2px]" v-for="country in serverList.suggest">
        <Server v-for="(city, name) in country.server" :country="country.tag" :city="name" :id="city.id"/>
      </div>
      <div>
        <p class="ml-8 text-small font-light">Altri Server</p>
        <div class="mt-8 bg-gray-600 w-full h-[1px]"></div>
      </div>
      <Dropdown :list="serverList"/>
    </div>
  </div>
</template>


<script setup>
import AccountSelector from "@/components/AccountSelector.vue";
import Status from "@/components/Status.vue";
import Server from "@/components/Server.vue";
import Dropdown from "@/components/Dropdown.vue";
import UserIcon from "@/components/UserIcon.vue";
import DropdownSettings from "@/components/DropdownSettings.vue";
</script>

<script>
export default {
  data() {
    return {
      isOpen: false,
      serverList: {
        "suggest": {
          "Germany": {
            "tag": "de",
            "server": {
              "Düsseldorf": {
                id: 1,
              },
              "Frankfurt": {
                id: 2,
              }
            }
          }
        },
        "other": {
          "Argentina": {
            "tag": "ar",
            "server": {
              "Buenos Aires": {
                id: 1,
              },
              "Cordoba": {
                id: 2,
              },
              "Rosario": {
                id: 3,
              },
              "Mendoza": {
                id: 4,
              },
            }
          },
          "Brasile": {
            "tag": "br",
            "server": {
              "Sao Paulo": {
                id: 1,
              },
              "Rio de Janeiro": {
                id: 2,
              },
              "Belo Horizonte": {
                id: 3,
              },
              "Salvador": {
                id: 4,
              },
            }
          },
          "Canada": {
            "tag": "ca",
            "server": {
              "Toronto": {
                id: 1,
              },
              "Montreal": {
                id: 2,
              },
              "Vancouver": {
                id: 3,
              },
              "Calgary": {
                id: 4,
              },
            }
          },
          "Cina": {
            "tag": "cn",
            "server": {
              "Shanghai": {
                id: 1,
              },
              "Beijing": {
                id: 2,
              },
              "Guangzhou": {
                id: 3,
              },
              "Shenzhen": {
                id: 4,
              },
            }
          },
          "Francia": {
            "tag": "fr",
            "server": {
              "Paris": {
                id: 1,
              },
              "Marseille": {
                id: 2,
              },
              "Lyon": {
                id: 3,
              },
              "Toulouse": {
                id: 4,
              },
            }
          },
          "Germania": {
            "tag": "de",
            "server": {
              "Düssendorf": {
                id: 1,
              },
              "Frankfurt": {
                id: 2,
              },
              "Munich": {
                id: 3,
              },
              "Hamburg": {
                id: 4,
              },
            }
          },
          "India": {
            "tag": "in",
            "server": {
              "Mumbai": {
                id: 1,
              },
              "Delhi": {
                id: 2,
              },
              "Bangalore": {
                id: 3,
              },
              "Hyderabad": {
                id: 4,
              },
            }
          },
          "Italia": {
            "tag": "it",
            "server": {
              "Roma": {
                id: 1,
              },
              "Milano": {
                id: 2,
              },
              "Napoli": {
                id: 3,
              },
              "Torino": {
                id: 4,
              },
              "Vari": {
                id: 5,
              },
            }
          },
          "Giappone": {
            "tag": "jp",
            "server": {
              "Tokyo": {
                id: 1,
              },
              "Osaka": {
                id: 2,
              },
              "Kyoto": {
                id: 3,
              },
              "Sapporo": {
                id: 4,
              },
            }
          },
        }
      },
    }
  },
  methods: {
    account() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>

<style scoped>
.sidebar-card::-webkit-scrollbar {
  width: 8px;
}

.sidebar-card::-webkit-scrollbar-track {
  border-bottom-right-radius: theme('borderRadius.DEFAULT');
  border-top-right-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card::-webkit-scrollbar-thumb {
  background: theme('colors.gray.900');
  border-radius: theme('borderRadius.DEFAULT');
}

.sidebar-card::-webkit-scrollbar-thumb:hover {
  background: black;
}

</style>
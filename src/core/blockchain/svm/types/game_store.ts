/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/game_store.json`.
 */
export type GameStore = {
  "address": "G9roe9Dm2Rr261z3xKNcNKcFeQ5wovr8VwEwRDQ8YJVs",
  "metadata": {
    "name": "gameStore",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
    {
      "name": "addAuthorizedProgram",
      "discriminator": [
        80,
        106,
        127,
        205,
        217,
        53,
        202,
        202
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "programId"
        },
        {
          "name": "authorizedProgram",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "programId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "role",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addPaymentToken",
      "discriminator": [
        19,
        203,
        48,
        148,
        80,
        1,
        179,
        140
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "acceptedPaymentToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  112,
                  116,
                  101,
                  100,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "buyGame",
      "discriminator": [
        230,
        118,
        208,
        28,
        185,
        30,
        230,
        155
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "authorizedRegistryProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "registryProgram"
              }
            ]
          }
        },
        {
          "name": "registryProgram",
          "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf"
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig",
            "gamePaymentOption"
          ]
        },
        {
          "name": "registryGame"
        },
        {
          "name": "gameStoreConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "paymentMint"
        },
        {
          "name": "acceptedPaymentToken",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  112,
                  116,
                  101,
                  100,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "paymentMint"
              }
            ]
          }
        },
        {
          "name": "gamePaymentOption",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "paymentMint"
              }
            ]
          }
        },
        {
          "name": "buyerPaymentAccount",
          "writable": true
        },
        {
          "name": "publisherPaymentAccount",
          "writable": true
        },
        {
          "name": "treasuryPaymentAccount",
          "writable": true
        },
        {
          "name": "referrerPaymentAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "storeActor",
          "signer": true
        },
        {
          "name": "authorizedActor",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  97,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "storeActor"
              }
            ],
            "program": {
              "kind": "account",
              "path": "pgl1Program"
            }
          }
        },
        {
          "name": "pgl1Program",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "license",
          "writable": true
        },
        {
          "name": "purchaseReceipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  114,
                  99,
                  104,
                  97,
                  115,
                  101,
                  95,
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "paidAmount",
          "type": "u64"
        },
        {
          "name": "referrer",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "clearDiscount",
      "discriminator": [
        131,
        52,
        86,
        51,
        205,
        130,
        233,
        36
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig"
          ]
        },
        {
          "name": "gameStoreConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initGameStoreConfig",
      "discriminator": [
        85,
        106,
        133,
        8,
        211,
        20,
        78,
        108
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "publisher",
          "signer": true,
          "optional": true
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "registryProgram",
          "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf"
        },
        {
          "name": "authorizedRegistryProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "registryProgram"
              }
            ]
          }
        },
        {
          "name": "game"
        },
        {
          "name": "registryGame"
        },
        {
          "name": "gameStoreConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "active",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initializeStore",
      "discriminator": [
        109,
        149,
        210,
        214,
        188,
        126,
        220,
        140
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        },
        {
          "name": "platformFeeBps",
          "type": "u16"
        },
        {
          "name": "defaultReferralBps",
          "type": "u16"
        },
        {
          "name": "maxReferralBps",
          "type": "u16"
        },
        {
          "name": "storeActor",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "removeGamePaymentOption",
      "discriminator": [
        25,
        2,
        53,
        66,
        23,
        57,
        219,
        154
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "game",
          "relations": [
            "gamePaymentOption"
          ]
        },
        {
          "name": "mint"
        },
        {
          "name": "gamePaymentOption",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "setDefaultReferral",
      "discriminator": [
        17,
        210,
        30,
        108,
        163,
        67,
        215,
        80
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "defaultReferralBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setDiscount",
      "discriminator": [
        185,
        99,
        11,
        85,
        175,
        2,
        42,
        198
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "registryProgram",
          "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf"
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig"
          ]
        },
        {
          "name": "registryGame"
        },
        {
          "name": "gameStoreConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "discountBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "discountStartsAt",
          "type": {
            "option": "i64"
          }
        },
        {
          "name": "discountExpiresAt",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "setGamePaymentOption",
      "discriminator": [
        122,
        86,
        158,
        12,
        148,
        161,
        8,
        46
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "publisher",
          "signer": true,
          "optional": true
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "registryProgram",
          "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf"
        },
        {
          "name": "authorizedRegistryProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "registryProgram"
              }
            ]
          }
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig"
          ]
        },
        {
          "name": "registryGame"
        },
        {
          "name": "gameStoreConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "acceptedPaymentToken",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  112,
                  116,
                  101,
                  100,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "gamePaymentOption",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "game"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "basePrice",
          "type": "u64"
        },
        {
          "name": "active",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setGameStoreActive",
      "discriminator": [
        89,
        147,
        76,
        11,
        9,
        108,
        85,
        219
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "registryProgram",
          "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf"
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig"
          ]
        },
        {
          "name": "registryGame"
        },
        {
          "name": "gameStoreConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "active",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setMaxReferral",
      "discriminator": [
        136,
        204,
        233,
        199,
        249,
        248,
        137,
        144
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "maxReferralBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setPlatformFee",
      "discriminator": [
        19,
        70,
        111,
        182,
        156,
        58,
        208,
        203
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "platformFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setReferralBps",
      "discriminator": [
        28,
        213,
        164,
        214,
        151,
        184,
        143,
        136
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authorizedSourceProgram",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "sourceProgram"
              }
            ]
          }
        },
        {
          "name": "sourceProgram",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "game",
          "relations": [
            "gameStoreConfig"
          ]
        },
        {
          "name": "gameStoreConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "game"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "referralBps",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "setStoreActor",
      "discriminator": [
        52,
        118,
        95,
        161,
        244,
        179,
        250,
        38
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newStoreActor",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setTreasury",
      "discriminator": [
        57,
        97,
        196,
        95,
        195,
        206,
        106,
        136
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateAuthorizedProgram",
      "discriminator": [
        70,
        84,
        196,
        221,
        239,
        138,
        173,
        238
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "authorizedProgram",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  122,
                  101,
                  100,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "authorized_program.program_id",
                "account": "authorizedProgram"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "active",
          "type": "bool"
        },
        {
          "name": "role",
          "type": {
            "option": "u8"
          }
        }
      ]
    },
    {
      "name": "updatePaymentToken",
      "discriminator": [
        240,
        107,
        161,
        243,
        84,
        148,
        183,
        126
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "storeConfig"
          ]
        },
        {
          "name": "storeConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "acceptedPaymentToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  101,
                  112,
                  116,
                  101,
                  100,
                  95,
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "accepted_payment_token.mint",
                "account": "acceptedPaymentToken"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "active",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "acceptedPaymentToken",
      "discriminator": [
        101,
        168,
        82,
        98,
        20,
        218,
        130,
        107
      ]
    },
    {
      "name": "authorizedActor",
      "discriminator": [
        155,
        89,
        1,
        231,
        51,
        170,
        32,
        23
      ]
    },
    {
      "name": "authorizedProgram",
      "discriminator": [
        18,
        164,
        77,
        11,
        61,
        253,
        148,
        223
      ]
    },
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    },
    {
      "name": "gamePaymentOption",
      "discriminator": [
        7,
        115,
        189,
        102,
        10,
        48,
        220,
        137
      ]
    },
    {
      "name": "gameStoreConfig",
      "discriminator": [
        147,
        51,
        220,
        95,
        81,
        151,
        19,
        208
      ]
    },
    {
      "name": "purchaseReceipt",
      "discriminator": [
        79,
        127,
        222,
        137,
        154,
        131,
        150,
        134
      ]
    },
    {
      "name": "registryGame",
      "discriminator": [
        44,
        59,
        51,
        135,
        203,
        140,
        48,
        151
      ]
    },
    {
      "name": "storeConfig",
      "discriminator": [
        108,
        23,
        66,
        65,
        67,
        124,
        167,
        135
      ]
    }
  ],
  "events": [
    {
      "name": "authorizedProgramAdded",
      "discriminator": [
        93,
        87,
        39,
        90,
        59,
        95,
        83,
        101
      ]
    },
    {
      "name": "authorizedProgramUpdated",
      "discriminator": [
        147,
        69,
        0,
        236,
        159,
        224,
        25,
        132
      ]
    },
    {
      "name": "defaultReferralUpdated",
      "discriminator": [
        250,
        99,
        212,
        118,
        114,
        118,
        67,
        20
      ]
    },
    {
      "name": "discountCleared",
      "discriminator": [
        116,
        185,
        191,
        70,
        149,
        105,
        215,
        75
      ]
    },
    {
      "name": "discountSet",
      "discriminator": [
        71,
        35,
        211,
        93,
        195,
        190,
        89,
        76
      ]
    },
    {
      "name": "gamePaymentOptionRemoved",
      "discriminator": [
        143,
        235,
        209,
        92,
        104,
        60,
        43,
        196
      ]
    },
    {
      "name": "gamePaymentOptionSet",
      "discriminator": [
        192,
        72,
        193,
        135,
        22,
        100,
        177,
        220
      ]
    },
    {
      "name": "gamePurchased",
      "discriminator": [
        171,
        159,
        122,
        155,
        186,
        98,
        154,
        92
      ]
    },
    {
      "name": "gameStoreActiveUpdated",
      "discriminator": [
        211,
        94,
        130,
        226,
        139,
        210,
        32,
        204
      ]
    },
    {
      "name": "gameStoreConfigInitialized",
      "discriminator": [
        102,
        197,
        95,
        106,
        2,
        26,
        222,
        46
      ]
    },
    {
      "name": "maxReferralUpdated",
      "discriminator": [
        141,
        6,
        17,
        123,
        33,
        45,
        145,
        211
      ]
    },
    {
      "name": "paymentTokenAdded",
      "discriminator": [
        181,
        200,
        132,
        33,
        4,
        116,
        83,
        186
      ]
    },
    {
      "name": "paymentTokenUpdated",
      "discriminator": [
        215,
        110,
        229,
        224,
        123,
        151,
        223,
        230
      ]
    },
    {
      "name": "platformFeeUpdated",
      "discriminator": [
        210,
        134,
        201,
        4,
        92,
        228,
        80,
        26
      ]
    },
    {
      "name": "purchaseReceiptCreated",
      "discriminator": [
        29,
        241,
        194,
        245,
        12,
        114,
        75,
        134
      ]
    },
    {
      "name": "referralBpsUpdated",
      "discriminator": [
        76,
        167,
        56,
        201,
        99,
        79,
        117,
        173
      ]
    },
    {
      "name": "storeActorUpdated",
      "discriminator": [
        32,
        168,
        32,
        150,
        91,
        110,
        161,
        9
      ]
    },
    {
      "name": "storeInitialized",
      "discriminator": [
        227,
        199,
        199,
        58,
        219,
        60,
        250,
        31
      ]
    },
    {
      "name": "treasuryUpdated",
      "discriminator": [
        80,
        239,
        54,
        168,
        43,
        38,
        85,
        145
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "invalidPlatformFeeBps",
      "msg": "Invalid platform fee bps"
    },
    {
      "code": 6002,
      "name": "invalidDefaultReferralBps",
      "msg": "Invalid default referral bps"
    },
    {
      "code": 6003,
      "name": "invalidMaxReferralBps",
      "msg": "Invalid max referral bps"
    },
    {
      "code": 6004,
      "name": "referralAboveMax",
      "msg": "Referral above max"
    },
    {
      "code": 6005,
      "name": "sourceProgramNotAuthorized",
      "msg": "Source program not authorized"
    },
    {
      "code": 6006,
      "name": "registryProgramNotAuthorized",
      "msg": "Registry program not authorized"
    },
    {
      "code": 6007,
      "name": "paymentTokenNotAllowed",
      "msg": "Payment token not allowed"
    },
    {
      "code": 6008,
      "name": "paymentTokenDisabled",
      "msg": "Payment token disabled"
    },
    {
      "code": 6009,
      "name": "invalidPrice",
      "msg": "Invalid price"
    },
    {
      "code": 6010,
      "name": "priceNotFound",
      "msg": "Price not found"
    },
    {
      "code": 6011,
      "name": "storeGameInactive",
      "msg": "Game not active in store"
    },
    {
      "code": 6012,
      "name": "gameNotActive",
      "msg": "Game not active in registry"
    },
    {
      "code": 6013,
      "name": "gameNotRegistered",
      "msg": "Game not registered"
    },
    {
      "code": 6014,
      "name": "alreadyOwned",
      "msg": "Already owned"
    },
    {
      "code": 6015,
      "name": "invalidDiscountBps",
      "msg": "Invalid discount bps"
    },
    {
      "code": 6016,
      "name": "invalidDiscountWindow",
      "msg": "Invalid discount window"
    },
    {
      "code": 6017,
      "name": "invalidReferralBps",
      "msg": "Invalid referral bps"
    },
    {
      "code": 6018,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6019,
      "name": "invalidPaymentAmount",
      "msg": "Invalid payment amount"
    },
    {
      "code": 6020,
      "name": "unsupportedSourceGameOwner",
      "msg": "Unsupported source game owner"
    },
    {
      "code": 6021,
      "name": "registryGameMismatch",
      "msg": "Registry game mismatch"
    },
    {
      "code": 6022,
      "name": "paymentFailed",
      "msg": "Payment failed"
    },
    {
      "code": 6023,
      "name": "licenseMintFailed",
      "msg": "License mint failed"
    },
    {
      "code": 6024,
      "name": "missingReferrerTokenAccount",
      "msg": "Missing referrer token account"
    },
    {
      "code": 6025,
      "name": "invalidReferrerTokenAccount",
      "msg": "Invalid referrer token account"
    },
    {
      "code": 6026,
      "name": "invalidTreasury",
      "msg": "Invalid treasury"
    },
    {
      "code": 6027,
      "name": "invalidStoreActor",
      "msg": "Invalid store actor"
    },
    {
      "code": 6028,
      "name": "gamePaymentOptionMismatch",
      "msg": "Game payment option mismatch"
    },
    {
      "code": 6029,
      "name": "invalidRole",
      "msg": "Invalid program role"
    },
    {
      "code": 6030,
      "name": "insufficientRole",
      "msg": "Program role insufficient for this action"
    }
  ],
  "types": [
    {
      "name": "acceptedPaymentToken",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorizedActor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actor",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorizedProgram",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "role",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorizedProgramAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "pubkey"
          },
          {
            "name": "role",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "authorizedProgramUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "role",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "defaultReferralUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "defaultReferralBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "discountCleared",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "discountSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "discountBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "discountStartsAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "discountExpiresAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u64"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gamePaymentOption",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "basePrice",
            "type": "u64"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gamePaymentOptionRemoved",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "gamePaymentOptionSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "basePrice",
            "type": "u64"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gamePurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "paymentMint",
            "type": "pubkey"
          },
          {
            "name": "paidAmount",
            "type": "u64"
          },
          {
            "name": "finalPrice",
            "type": "u64"
          },
          {
            "name": "referrer",
            "type": "pubkey"
          },
          {
            "name": "referralBpsApplied",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "gameStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "suspended"
          },
          {
            "name": "banned"
          }
        ]
      }
    },
    {
      "name": "gameStoreActiveUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gameStoreConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          },
          {
            "name": "referralBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "discountBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "discountStartsAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "discountExpiresAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "gameStoreConfigInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "maxReferralUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "maxReferralBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "paymentTokenAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "paymentTokenUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "platformFeeUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "purchaseReceipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "paymentMint",
            "type": "pubkey"
          },
          {
            "name": "paidAmount",
            "type": "u64"
          },
          {
            "name": "finalPrice",
            "type": "u64"
          },
          {
            "name": "referrer",
            "type": "pubkey"
          },
          {
            "name": "referralBpsApplied",
            "type": "u16"
          },
          {
            "name": "purchasedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "purchaseReceiptCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "referralBpsUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "referralBps",
            "type": {
              "option": "u16"
            }
          }
        ]
      }
    },
    {
      "name": "registryGame",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "registeredAt",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "gameStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "storeActorUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldStoreActor",
            "type": "pubkey"
          },
          {
            "name": "newStoreActor",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "storeConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "defaultReferralBps",
            "type": "u16"
          },
          {
            "name": "maxReferralBps",
            "type": "u16"
          },
          {
            "name": "storeActor",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "storeInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "treasuryUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "treasury",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};

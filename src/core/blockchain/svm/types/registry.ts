/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/registry.json`.
 */
export type Registry = {
  "address": "CxQCfVWCBE6tLwmEi3z7gXpniR21UyjvVvE6VytVcnyf",
  "metadata": {
    "name": "registry",
    "version": "0.1.0",
    "spec": "0.1.0"
  },
  "instructions": [
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
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
      "args": [
        {
          "name": "feeAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeRegistryGame",
      "discriminator": [
        137,
        24,
        5,
        199,
        115,
        15,
        111,
        244
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
          "name": "game"
        },
        {
          "name": "registryGame",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "registry_game.game",
                "account": "registryGame"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "createGameAndRegister",
      "discriminator": [
        78,
        43,
        148,
        255,
        70,
        148,
        207,
        218
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
          "name": "publisherPaymentAccount",
          "writable": true
        },
        {
          "name": "treasuryPaymentAccount",
          "writable": true
        },
        {
          "name": "registryGame",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  103,
                  97,
                  109,
                  101
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
          "name": "game",
          "writable": true
        },
        {
          "name": "pglCreatorState",
          "writable": true
        },
        {
          "name": "pglConfig"
        },
        {
          "name": "pglTreasury",
          "writable": true
        },
        {
          "name": "pgl1Program",
          "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT"
        },
        {
          "name": "storeProgram"
        },
        {
          "name": "storeAuthorizedSourceProgram",
          "docs": [
            "This is an existence check only — the game-store program validates",
            "the account data when it processes the CPI. Registry does not",
            "deserialize or trust data from this account."
          ],
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
                  115,
                  111,
                  117,
                  114,
                  99,
                  101,
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
                "path": "pgl1Program"
              }
            ]
          }
        },
        {
          "name": "storeAuthorizedRegistryProgram",
          "docs": [
            "This is an existence check only — the game-store program validates",
            "the account data when it processes the CPI. Registry does not",
            "deserialize or trust data from this account."
          ],
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
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
                "path": "storeProgram"
              }
            ]
          }
        },
        {
          "name": "storeGameStoreConfig",
          "writable": true
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
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "basePrice",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "mintToken",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createPublishGrant",
      "discriminator": [
        83,
        236,
        41,
        49,
        105,
        161,
        61,
        173
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
          "name": "publisher",
          "signer": true
        },
        {
          "name": "publishGrant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  108,
                  105,
                  115,
                  104,
                  95,
                  103,
                  114,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "publisher"
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
          "name": "expiredAt",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "initializeRegistry",
      "discriminator": [
        189,
        181,
        20,
        17,
        174,
        57,
        249,
        59
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
        }
      ]
    },
    {
      "name": "removePaymentToken",
      "discriminator": [
        119,
        18,
        240,
        223,
        126,
        168,
        165,
        117
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
        }
      ],
      "args": []
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
            "config"
          ]
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
      "name": "updateGameStatus",
      "discriminator": [
        31,
        175,
        127,
        242,
        51,
        244,
        172,
        185
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
          "name": "registryGame",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "registry_game.game",
                "account": "registryGame"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "status",
          "type": "u8"
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
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
        }
      ],
      "args": [
        {
          "name": "active",
          "type": "bool"
        },
        {
          "name": "feeAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePublishGrant",
      "discriminator": [
        185,
        215,
        123,
        61,
        37,
        3,
        134,
        206
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
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
          "name": "publisher",
          "signer": true
        },
        {
          "name": "publishGrant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  117,
                  98,
                  108,
                  105,
                  115,
                  104,
                  95,
                  103,
                  114,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "publisher"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "expiredAt",
          "type": {
            "option": "i64"
          }
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
      "name": "pglConfig",
      "discriminator": [
        152,
        183,
        211,
        24,
        96,
        186,
        93,
        22
      ]
    },
    {
      "name": "publishGrant",
      "discriminator": [
        96,
        84,
        122,
        50,
        0,
        193,
        171,
        194
      ]
    },
    {
      "name": "registryConfig",
      "discriminator": [
        23,
        118,
        10,
        246,
        173,
        231,
        243,
        156
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
    }
  ],
  "events": [
    {
      "name": "gameClosed",
      "discriminator": [
        178,
        203,
        179,
        224,
        43,
        18,
        209,
        4
      ]
    },
    {
      "name": "gameRegistered",
      "discriminator": [
        2,
        83,
        36,
        122,
        249,
        190,
        106,
        31
      ]
    },
    {
      "name": "gameStatusUpdated",
      "discriminator": [
        247,
        12,
        74,
        230,
        132,
        141,
        74,
        217
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
      "name": "paymentTokenRemoved",
      "discriminator": [
        27,
        119,
        226,
        186,
        75,
        240,
        81,
        88
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
      "name": "publishGrantCreated",
      "discriminator": [
        230,
        55,
        123,
        194,
        87,
        226,
        125,
        230
      ]
    },
    {
      "name": "publishGrantUpdated",
      "discriminator": [
        78,
        188,
        110,
        48,
        49,
        206,
        215,
        83
      ]
    },
    {
      "name": "registryInitialized",
      "discriminator": [
        144,
        138,
        62,
        105,
        58,
        38,
        100,
        177
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
      "name": "paymentTokenNotAllowed",
      "msg": "Payment token not allowed"
    },
    {
      "code": 6002,
      "name": "paymentTokenDisabled",
      "msg": "Payment token disabled"
    },
    {
      "code": 6003,
      "name": "invalidFeeAmount",
      "msg": "Invalid fee amount"
    },
    {
      "code": 6004,
      "name": "registrationFeeNotSatisfied",
      "msg": "Registration fee not satisfied"
    },
    {
      "code": 6005,
      "name": "gameAlreadyRegistered",
      "msg": "Game already registered"
    },
    {
      "code": 6006,
      "name": "invalidGameId",
      "msg": "Invalid game id"
    },
    {
      "code": 6007,
      "name": "gameNotFound",
      "msg": "Game not found"
    },
    {
      "code": 6008,
      "name": "invalidStatusTransition",
      "msg": "Invalid status transition"
    },
    {
      "code": 6009,
      "name": "invalidExpiry",
      "msg": "Invalid expiry"
    },
    {
      "code": 6010,
      "name": "invalidMetadataUri",
      "msg": "Invalid metadata URI"
    },
    {
      "code": 6011,
      "name": "invalidPublishGrantAccount",
      "msg": "Invalid publish grant account"
    },
    {
      "code": 6012,
      "name": "invalidTreasury",
      "msg": "Invalid treasury"
    },
    {
      "code": 6013,
      "name": "invalidPgl1Program",
      "msg": "Invalid PGL-1 program"
    },
    {
      "code": 6014,
      "name": "invalidPgl1Config",
      "msg": "Invalid PGL-1 config account"
    },
    {
      "code": 6015,
      "name": "invalidStoreProgram",
      "msg": "Invalid store program"
    },
    {
      "code": 6016,
      "name": "invalidPrice",
      "msg": "Invalid price"
    },
    {
      "code": 6017,
      "name": "missingStoreAccounts",
      "msg": "Missing store accounts for paid game"
    },
    {
      "code": 6018,
      "name": "gameNotClosable",
      "msg": "Game not closable (must be Suspended or Banned)"
    },
    {
      "code": 6019,
      "name": "gameMismatch",
      "msg": "Game mismatch (registry_game.game != game)"
    },
    {
      "code": 6020,
      "name": "insufficientFeeBalance",
      "msg": "Insufficient fee balance in publisher payment account"
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
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
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
      "name": "gameClosed",
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
            "name": "closedBy",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "gameRegistered",
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
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "registeredAt",
            "type": "i64"
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
      "name": "gameStatusUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "oldStatus",
            "type": "u8"
          },
          {
            "name": "newStatus",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
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
          },
          {
            "name": "feeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "paymentTokenRemoved",
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
            "name": "oldActive",
            "type": "bool"
          },
          {
            "name": "newActive",
            "type": "bool"
          },
          {
            "name": "oldFeeAmount",
            "type": "u64"
          },
          {
            "name": "newFeeAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "pglConfig",
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
            "name": "createGameFeeLamports",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "publishGrant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiredAt",
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
      "name": "publishGrantCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "expiredAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "publishGrantUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "oldExpiredAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "newExpiredAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "registryConfig",
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
            "name": "pgl1Program",
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
      "name": "registryInitialized",
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
            "name": "pgl1Program",
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
            "name": "oldTreasury",
            "type": "pubkey"
          },
          {
            "name": "newTreasury",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};

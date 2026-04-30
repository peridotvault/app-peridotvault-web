/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pgl1.json`.
 */
export type Pgl1 = {
  "address": "7ddrr9b2ReD17kk73LLnW88tVT4fEpzGEY4rPb8hbQtT",
  "metadata": {
    "name": "pgl1",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addAuthorizedActor",
      "discriminator": [
        36,
        250,
        169,
        0,
        167,
        155,
        131,
        155
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "actor"
        },
        {
          "name": "pglConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "authorizedActor",
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
                  97,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "actor"
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
      "name": "closeAuthorizedActor",
      "discriminator": [
        127,
        140,
        77,
        23,
        48,
        163,
        227,
        117
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "actor"
        },
        {
          "name": "pglConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "authorizedActor",
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
                  97,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "actor"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "closeCreatorState",
      "discriminator": [
        130,
        195,
        143,
        56,
        69,
        235,
        205,
        164
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "creatorState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "pglConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "treasury",
          "writable": true
        },
        {
          "name": "creatorState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  97,
                  116,
                  111,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              }
            ]
          }
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "creator_state.next_nonce",
                "account": "creatorState"
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
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "deactivateAuthorizedActor",
      "discriminator": [
        180,
        68,
        94,
        97,
        242,
        126,
        165,
        142
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "actor"
        },
        {
          "name": "pglConfig",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "authorizedActor",
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
                  97,
                  99,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "actor"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initializePgl",
      "discriminator": [
        27,
        26,
        103,
        210,
        20,
        202,
        72,
        9
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "pglConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "createGameFeeLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintLicense",
      "discriminator": [
        57,
        204,
        93,
        84,
        160,
        241,
        254,
        52
      ],
      "accounts": [
        {
          "name": "actor",
          "writable": true,
          "signer": true
        },
        {
          "name": "holder"
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
                "path": "actor"
              }
            ]
          }
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.creator",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "license",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  99,
                  101,
                  110,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "holder"
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
          "name": "expiresAt",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "renewLicense",
      "discriminator": [
        104,
        243,
        122,
        253,
        203,
        203,
        199,
        64
      ],
      "accounts": [
        {
          "name": "actor",
          "signer": true
        },
        {
          "name": "holder"
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
                "path": "actor"
              }
            ]
          }
        },
        {
          "name": "game",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.creator",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "game"
              }
            ]
          }
        },
        {
          "name": "license",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  99,
                  101,
                  110,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "holder"
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
          "name": "expiresAt",
          "type": "i64"
        }
      ]
    },
    {
      "name": "setAuthority",
      "discriminator": [
        133,
        250,
        37,
        21,
        110,
        163,
        26,
        121
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "pglConfig"
          ]
        },
        {
          "name": "pglConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setCreateGameFee",
      "discriminator": [
        180,
        158,
        35,
        163,
        88,
        50,
        43,
        157
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "pglConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
          "name": "createGameFeeLamports",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setMetadataUri",
      "discriminator": [
        30,
        134,
        3,
        67,
        40,
        90,
        245,
        34
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.creator",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "game"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "metadataUri",
          "type": "string"
        }
      ]
    },
    {
      "name": "setPublisher",
      "discriminator": [
        110,
        54,
        4,
        216,
        151,
        85,
        46,
        91
      ],
      "accounts": [
        {
          "name": "publisher",
          "signer": true
        },
        {
          "name": "game",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "game.creator",
                "account": "game"
              },
              {
                "kind": "account",
                "path": "game.nonce",
                "account": "game"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newPublisher",
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
          "signer": true
        },
        {
          "name": "pglConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  103,
                  108,
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
    }
  ],
  "accounts": [
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
      "name": "creatorState",
      "discriminator": [
        37,
        107,
        190,
        213,
        241,
        216,
        73,
        180
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
      "name": "license",
      "discriminator": [
        248,
        152,
        195,
        100,
        185,
        108,
        176,
        231
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
    }
  ],
  "events": [
    {
      "name": "authorityUpdated",
      "discriminator": [
        133,
        207,
        24,
        122,
        14,
        234,
        91,
        34
      ]
    },
    {
      "name": "authorizedActorAdded",
      "discriminator": [
        250,
        129,
        52,
        168,
        132,
        136,
        87,
        233
      ]
    },
    {
      "name": "authorizedActorClosed",
      "discriminator": [
        132,
        144,
        215,
        15,
        101,
        217,
        165,
        105
      ]
    },
    {
      "name": "authorizedActorDeactivated",
      "discriminator": [
        15,
        186,
        219,
        51,
        59,
        97,
        169,
        224
      ]
    },
    {
      "name": "createGameFeeUpdated",
      "discriminator": [
        26,
        108,
        111,
        31,
        35,
        191,
        25,
        166
      ]
    },
    {
      "name": "creatorStateClosed",
      "discriminator": [
        42,
        236,
        36,
        3,
        16,
        135,
        232,
        189
      ]
    },
    {
      "name": "gameCreated",
      "discriminator": [
        218,
        25,
        150,
        94,
        177,
        112,
        96,
        2
      ]
    },
    {
      "name": "licenseMinted",
      "discriminator": [
        7,
        20,
        239,
        251,
        236,
        115,
        194,
        94
      ]
    },
    {
      "name": "licenseRenewed",
      "discriminator": [
        149,
        149,
        125,
        167,
        158,
        247,
        82,
        74
      ]
    },
    {
      "name": "metadataUriUpdated",
      "discriminator": [
        99,
        250,
        233,
        172,
        167,
        129,
        218,
        144
      ]
    },
    {
      "name": "pglInitialized",
      "discriminator": [
        218,
        242,
        55,
        59,
        26,
        140,
        246,
        62
      ]
    },
    {
      "name": "publisherUpdated",
      "discriminator": [
        169,
        238,
        92,
        110,
        140,
        167,
        198,
        170
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
      "name": "authorizedActorInactive",
      "msg": "Authorized actor is inactive"
    },
    {
      "code": 6002,
      "name": "insufficientCreateGameFee",
      "msg": "Insufficient create game fee"
    },
    {
      "code": 6003,
      "name": "invalidGameId",
      "msg": "Invalid game id"
    },
    {
      "code": 6004,
      "name": "invalidMetadataUri",
      "msg": "Invalid metadata URI"
    },
    {
      "code": 6005,
      "name": "gameAlreadyExists",
      "msg": "Game already exists"
    },
    {
      "code": 6006,
      "name": "licenseAlreadyExists",
      "msg": "License already exists"
    },
    {
      "code": 6007,
      "name": "licenseNotFound",
      "msg": "License not found"
    },
    {
      "code": 6008,
      "name": "invalidExpiry",
      "msg": "Invalid expiry"
    },
    {
      "code": 6009,
      "name": "nonceOverflow",
      "msg": "Creator nonce overflow"
    },
    {
      "code": 6010,
      "name": "creatorStateNotEmpty",
      "msg": "Creator state still has pending games"
    },
    {
      "code": 6011,
      "name": "authorizedActorStillActive",
      "msg": "Authorized actor is still active"
    }
  ],
  "types": [
    {
      "name": "authorityUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldAuthority",
            "type": "pubkey"
          },
          {
            "name": "newAuthority",
            "type": "pubkey"
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
      "name": "authorizedActorAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actor",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "authorizedActorClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actor",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "authorizedActorDeactivated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "actor",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "createGameFeeUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldFee",
            "type": "u64"
          },
          {
            "name": "newFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "creatorState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "nextNonce",
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
      "name": "creatorStateClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
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
      "name": "gameCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "nonce",
            "type": "u64"
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
          }
        ]
      }
    },
    {
      "name": "license",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "holder",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "issuedAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
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
      "name": "licenseMinted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "license",
            "type": "pubkey"
          },
          {
            "name": "holder",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "issuedAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "licenseRenewed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "license",
            "type": "pubkey"
          },
          {
            "name": "holder",
            "type": "pubkey"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "oldExpiresAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "newExpiresAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "metadataUriUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "oldUri",
            "type": "string"
          },
          {
            "name": "newUri",
            "type": "string"
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
      "name": "pglInitialized",
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
          }
        ]
      }
    },
    {
      "name": "publisherUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "oldPublisher",
            "type": "pubkey"
          },
          {
            "name": "newPublisher",
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
            "name": "authority",
            "type": "pubkey"
          },
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

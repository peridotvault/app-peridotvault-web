/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pgc1.json`.
 */
export type Pgc1 = {
  "address": "BDqzDEUTfzskChktZwNsceHj3Vnr7g3322JgPKrMqsip",
  "metadata": {
    "name": "pgc1",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameState",
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
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "gameId"
              }
            ]
          }
        },
        {
          "name": "gameAuthority",
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
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              }
            ]
          }
        },
        {
          "name": "publisherAccount"
        },
        {
          "name": "publisherMinterAuth",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "publisherAccount"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
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
          "name": "publisher",
          "type": "pubkey"
        },
        {
          "name": "metadataUri",
          "type": "string"
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
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "user",
          "docs": [
            "Receiver of license"
          ]
        },
        {
          "name": "gameAuthority",
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
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              }
            ]
          }
        },
        {
          "name": "minterAuth",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "licenseAccount",
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
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
          "signer": true,
          "relations": [
            "gameState"
          ]
        },
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "gameAuthority",
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
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              }
            ]
          }
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
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
      "name": "setMinter",
      "discriminator": [
        13,
        170,
        92,
        172,
        137,
        194,
        39,
        2
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true,
          "relations": [
            "gameState"
          ]
        },
        {
          "name": "gameState"
        },
        {
          "name": "account"
        },
        {
          "name": "minterAuth",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "account"
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
          "name": "isAuthorized",
          "type": "bool"
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
          "writable": true,
          "signer": true,
          "relations": [
            "gameState"
          ]
        },
        {
          "name": "gameState",
          "writable": true
        },
        {
          "name": "newPublisher"
        },
        {
          "name": "oldPublisherMinterAuth",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "publisher"
              }
            ]
          }
        },
        {
          "name": "newPublisherMinterAuth",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  101,
                  114,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "gameState"
              },
              {
                "kind": "account",
                "path": "newPublisher"
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
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    },
    {
      "name": "licenseAccount",
      "discriminator": [
        120,
        20,
        28,
        217,
        130,
        168,
        223,
        118
      ]
    },
    {
      "name": "minterAuthority",
      "discriminator": [
        64,
        208,
        118,
        12,
        174,
        104,
        47,
        5
      ]
    }
  ],
  "events": [
    {
      "name": "initialized",
      "discriminator": [
        208,
        213,
        115,
        98,
        115,
        82,
        201,
        209
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
      "name": "minterUpdated",
      "discriminator": [
        8,
        124,
        66,
        45,
        176,
        53,
        49,
        153
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "emptyGameId",
      "msg": "Game ID must not be empty"
    },
    {
      "code": 6001,
      "name": "emptyMetadataUri",
      "msg": "Metadata URI must not be empty"
    },
    {
      "code": 6002,
      "name": "invalidPublisher",
      "msg": "Invalid publisher"
    },
    {
      "code": 6003,
      "name": "invalidMinter",
      "msg": "Invalid minter"
    },
    {
      "code": 6004,
      "name": "invalidReceiver",
      "msg": "Invalid receiver"
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6006,
      "name": "stringTooLong",
      "msg": "String too long"
    },
    {
      "code": 6007,
      "name": "licenseAccountMismatch",
      "msg": "License account mismatch"
    },
    {
      "code": 6008,
      "name": "licenseAccountNotFound",
      "msg": "License account not found"
    }
  ],
  "types": [
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "mint",
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
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "initialized",
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
            "name": "initialMinter",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "licenseAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "issuedAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "badgeMinted",
            "type": "bool"
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
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "issuedAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          },
          {
            "name": "minter",
            "type": "pubkey"
          },
          {
            "name": "badgeMinted",
            "type": "bool"
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
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "minterAuthority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "account",
            "type": "pubkey"
          },
          {
            "name": "isAuthorized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "minterUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "account",
            "type": "pubkey"
          },
          {
            "name": "isAuthorized",
            "type": "bool"
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
    }
  ]
};

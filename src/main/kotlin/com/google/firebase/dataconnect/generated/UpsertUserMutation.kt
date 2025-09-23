
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated



public interface UpsertUserMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      UpsertUserMutation.Data,
      UpsertUserMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val username: String
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("user_upsert") val key: UserKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "UpsertUser"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun UpsertUserMutation.ref(
  
    username: String,
  
  
): com.google.firebase.dataconnect.MutationRef<
    UpsertUserMutation.Data,
    UpsertUserMutation.Variables
  > =
  ref(
    
      UpsertUserMutation.Variables(
        username=username,
  
      )
    
  )

public suspend fun UpsertUserMutation.execute(
  
    username: String,
  
  
  ): com.google.firebase.dataconnect.MutationResult<
    UpsertUserMutation.Data,
    UpsertUserMutation.Variables
  > =
  ref(
    
      username=username,
  
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
